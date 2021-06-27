import logo from '../../images/logo.svg';
import { Link } from 'react-router-dom';
import { LOGIN_ROUTE, REGISTER_ROUTE, TEAMS_ROUTE } from '../../routing/routeConstants';
import { Helmet } from 'react-helmet';
import React, { useEffect, useState } from 'react';
import { Button, Container, Dimmer, Divider, Grid, Header, Icon, Image, List, Loader, Menu, Segment, Sidebar, Visibility } from 'semantic-ui-react';
import { createMedia } from '@artsy/fresnel';
import { useAuth } from '../AuthProvider';
import { responseToString } from '../../api/httpHelpers';
import { useApi } from '../../api/starskyApiClient';
import { UserResponse } from '../../api/__generated__';
import { IUserProps } from '../props/IUserProps';

const { MediaContextProvider, Media } = createMedia({
    breakpoints: {
        mobile: 0,
        tablet: 768,
        computer: 1024,
    },
});

interface IProps {
    mobile: boolean;
}

/* Heads up!
 * HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled
 * components for such things.
 */
function HomepageHeading(props: IProps) {
    return (
        <Container text>
            <Header
                content="Starsky"
                as="h1"
                inverted
                style={{
                    fontSize: props.mobile ? '2em' : '4em',
                    fontWeight: 'normal',
                    marginBottom: 0,
                    marginTop: props.mobile ? '1.5em' : '3em',
                }}
            />
            <Header
                as="h2"
                content="Management application for employee scheduling"
                inverted
                style={{
                    fontSize: props.mobile ? '1.5em' : '1.7em',
                    fontWeight: 'normal',
                    marginTop: props.mobile ? '0.5em' : '1.5em',
                }}
            />
            <Link to={TEAMS_ROUTE}>
                <Button primary size="huge">
                    Try it now!
                    <Icon name="arrow right" />
                </Button>
            </Link>
        </Container>
    );
}

const DesktopContainer: React.FC<IUserProps> = ({ children, authenticatedUser }) => {
    const [showFixedMenu, setShowFixedMenu] = useState(false);

    return (
        <Media greaterThan="mobile">
            <Visibility once={false} onBottomPassed={() => setShowFixedMenu(true)} onBottomPassedReverse={() => setShowFixedMenu(false)}>
                <Segment inverted textAlign="center" style={{ minHeight: 700, padding: '1em 0em' }} vertical>
                    <Menu fixed={showFixedMenu ? 'top' : undefined} inverted={!showFixedMenu} pointing={!showFixedMenu} secondary={!showFixedMenu} size="large">
                        <Container>
                            <Menu.Item as="a" active>
                                Home
                            </Menu.Item>
                            <Menu.Item as="a">Work</Menu.Item>
                            <Menu.Item as="a">Company</Menu.Item>
                            <Menu.Item as="a">Careers</Menu.Item>
                            <Menu.Item position="right">
                                {authenticatedUser ? (
                                    <>Welcome {authenticatedUser?.name}!</>
                                ) : (
                                    <div>
                                        <Link to={LOGIN_ROUTE}>
                                            <Button as="a" inverted={!showFixedMenu}>
                                                Login
                                            </Button>
                                        </Link>
                                        <Link to={REGISTER_ROUTE}>
                                            <Button as="a" inverted={!showFixedMenu} primary={showFixedMenu} style={{ marginLeft: '0.5em' }}>
                                                Register
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </Menu.Item>
                        </Container>
                    </Menu>
                    <HomepageHeading mobile={false} />
                </Segment>
            </Visibility>

            {children}
        </Media>
    );
};

const MobileContainer: React.FC<IUserProps> = ({ children, authenticatedUser }) => {
    const [sidebarOpened, setSidebarOpened] = useState(false);

    return (
        <Media at="mobile">
            <Sidebar.Pushable>
                <Sidebar as={Menu} animation="overlay" inverted onHide={() => setSidebarOpened(false)} vertical visible={sidebarOpened}>
                    <Menu.Item as="a" active>
                        Home
                    </Menu.Item>
                    <Menu.Item as="a">Work</Menu.Item>
                    <Menu.Item as="a">Company</Menu.Item>
                    <Menu.Item as="a">Careers</Menu.Item>
                    {!authenticatedUser ? (
                        <>
                            <Link to={LOGIN_ROUTE}>
                                <Menu.Item as="a">Login</Menu.Item>
                            </Link>
                            <Link to={REGISTER_ROUTE}>
                                <Menu.Item as="a">Register</Menu.Item>
                            </Link>
                        </>
                    ) : (
                        <></>
                    )}
                </Sidebar>

                <Sidebar.Pusher dimmed={sidebarOpened}>
                    <Segment inverted textAlign="center" style={{ minHeight: 350, padding: '1em 0em' }} vertical>
                        <Container>
                            <Menu inverted pointing secondary size="large">
                                <Menu.Item onClick={() => setSidebarOpened(true)}>
                                    <Icon name="sidebar" />
                                </Menu.Item>
                                <Menu.Item position="right">
                                    {authenticatedUser ? (
                                        <>Welcome {authenticatedUser?.name}!</>
                                    ) : (
                                        <>
                                            <Link to={LOGIN_ROUTE}>
                                                <Button as="a" inverted>
                                                    Login
                                                </Button>
                                            </Link>
                                            <Link to={REGISTER_ROUTE}>
                                                <Button as="a" inverted style={{ marginLeft: '0.5em' }}>
                                                    Register
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                </Menu.Item>
                            </Menu>
                        </Container>
                        <HomepageHeading mobile={true} />
                    </Segment>

                    {children}
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        </Media>
    );
};

const ResponsiveContainer: React.FC<IUserProps> = ({ children, authenticatedUser }) => (
    /* Heads up!
     * For large applications it may not be best option to put all page into these containers at
     * they will be rendered twice for SSR.
     */
    <MediaContextProvider>
        <DesktopContainer authenticatedUser={authenticatedUser}>{children}</DesktopContainer>
        <MobileContainer authenticatedUser={authenticatedUser}>{children}</MobileContainer>
    </MediaContextProvider>
);

const HomePage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [authenticatedUser, setAuthenticatedUser] = useState<UserResponse | null>(null);

    const { token } = useAuth();
    const apis = useApi(token);

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        if (token != null) {
            await apis.userApi
                .getUser()
                .then((value) => {
                    setAuthenticatedUser(value);
                })
                .catch((reason: Response) => {
                    console.error(responseToString(reason));
                });
        }

        setLoading(false);
    }

    return (
        <div>
            <div hidden={!loading}>
                <Dimmer active inverted>
                    <Loader content="Please wait..." />
                </Dimmer>
            </div>
            <div hidden={loading}>
                <ResponsiveContainer authenticatedUser={authenticatedUser}>
                    <Helmet title={'Home | Starsky'} />
                    <Segment style={{ padding: '8em 0em' }} vertical>
                        <Grid container stackable verticalAlign="middle">
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    <Header as="h3" style={{ fontSize: '2em' }}>
                                        We Help Companies and Companions
                                    </Header>
                                    <p style={{ fontSize: '1.33em' }}>
                                        We can give your company superpowers to do things that they never thought possible. Let us delight your customers and
                                        empower your needs... through pure data analytics.
                                    </p>
                                    <Header as="h3" style={{ fontSize: '2em' }}>
                                        We Make Bananas That Can Dance
                                    </Header>
                                    <p style={{ fontSize: '1.33em' }}>
                                        Yes thats right, you thought it was the stuff of dreams, but even bananas can be bioengineered.
                                    </p>
                                </Grid.Column>
                                <Grid.Column floated="right" width={6}>
                                    <Image rounded size="large" src={logo} />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column textAlign="center">
                                    <Button size="huge">Check Them Out</Button>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>

                    <Segment style={{ padding: '0em' }} vertical>
                        <Grid celled="internally" columns="equal" stackable>
                            <Grid.Row textAlign="center">
                                <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                                    <Header as="h3" style={{ fontSize: '2em' }}>
                                        What a Company
                                    </Header>
                                    <p style={{ fontSize: '1.33em' }}>That is what they all say about us</p>
                                </Grid.Column>
                                <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                                    <Header as="h3" style={{ fontSize: '2em' }}>
                                        I shouldnt have gone with their competitor.
                                    </Header>
                                    <p style={{ fontSize: '1.33em' }}>
                                        <Image avatar src="/images/avatar/large/nan.jpg" />
                                        <b>Nan</b> Chief Fun Officer Acme Toys
                                    </p>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>

                    <Segment style={{ padding: '8em 0em' }} vertical>
                        <Container text>
                            <Header as="h3" style={{ fontSize: '2em' }}>
                                Breaking The Grid, Grabs Your Attention
                            </Header>
                            <p style={{ fontSize: '1.33em' }}>
                                Instead of focusing on content creation and hard work, we have learned how to master the art of doing nothing by providing
                                massive amounts of whitespace and generic content that can seem massive, monolithic and worth your attention.
                            </p>
                            <Button as="a" size="large">
                                Read More
                            </Button>

                            <Divider as="h4" className="header" horizontal style={{ margin: '3em 0em', textTransform: 'uppercase' }}>
                                <a href="#">Case Studies</a>
                            </Divider>

                            <Header as="h3" style={{ fontSize: '2em' }}>
                                Did We Tell You About Our Bananas?
                            </Header>
                            <p style={{ fontSize: '1.33em' }}>
                                Yes I know you probably disregarded the earlier boasts as non-sequitur filler content, but its really true. It took years of
                                gene splicing and combinatory DNA research, but our bananas can really dance.
                            </p>
                            <Button as="a" size="large">
                                Im Still Quite Interested
                            </Button>
                        </Container>
                    </Segment>

                    <Segment inverted vertical style={{ padding: '5em 0em' }}>
                        <Container>
                            <Grid divided inverted stackable>
                                <Grid.Row>
                                    <Grid.Column width={3}>
                                        <Header inverted as="h4" content="About" />
                                        <List link inverted>
                                            <List.Item as="a">Sitemap</List.Item>
                                            <List.Item as="a">Contact Us</List.Item>
                                            <List.Item as="a">Religious Ceremonies</List.Item>
                                            <List.Item as="a">Gazebo Plans</List.Item>
                                        </List>
                                    </Grid.Column>
                                    <Grid.Column width={3}>
                                        <Header inverted as="h4" content="Services" />
                                        <List link inverted>
                                            <List.Item as="a">Banana Pre-Order</List.Item>
                                            <List.Item as="a">DNA FAQ</List.Item>
                                            <List.Item as="a">How To Access</List.Item>
                                            <List.Item as="a">Favorite X-Men</List.Item>
                                        </List>
                                    </Grid.Column>
                                    <Grid.Column width={7}>
                                        <Header as="h4" inverted>
                                            Footer Header
                                        </Header>
                                        <p>Extra space for a call to action inside the footer that could help re-engage users.</p>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Container>
                    </Segment>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
export default HomePage;
