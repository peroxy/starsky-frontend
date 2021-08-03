import logo from '../../images/logo.svg';
import { Link } from 'react-router-dom';
import { LOGIN_ROUTE, REGISTER_ROUTE, TEAMS_ROUTE } from '../../routing/routeConstants';
import { Helmet } from 'react-helmet';
import React, { useEffect, useState } from 'react';
import { Button, Container, Dimmer, Divider, Grid, Header, Icon, Image, Loader, Menu, Segment, Visibility } from 'semantic-ui-react';
import { createMedia } from '@artsy/fresnel';
import { useAuth } from '../AuthProvider';
import { responseToString } from '../../api/httpHelpers';
import { useApi } from '../../api/starskyApiClient';
import { UserResponse } from '../../api/__generated__';
import { IUserProps } from '../props/IUserProps';
import { MAX_MOBILE_WIDTH, MAX_TABLET_WIDTH } from '../../util/mediaConstants';

export const { MediaContextProvider, Media } = createMedia({
    breakpoints: {
        mobile: 0,
        tablet: MAX_MOBILE_WIDTH,
        computer: MAX_TABLET_WIDTH,
    },
});

interface IProps {
    mobile: boolean;
    authenticatedUser: UserResponse | null;
}

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
                    {props.authenticatedUser ? 'Enter now!' : 'Try it now!'}
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
                    <HomepageHeading mobile={false} authenticatedUser={authenticatedUser} />
                </Segment>
            </Visibility>

            {children}
        </Media>
    );
};

const MobileContainer: React.FC<IUserProps> = ({ children, authenticatedUser }) => {
    return (
        <Media at="mobile">
            <Segment inverted textAlign="center" style={{ minHeight: 350, padding: '1em 0em' }} vertical>
                <Container>
                    <Menu inverted pointing secondary size="large">
                        <Menu.Item>
                            <Icon name="home" />
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
                <HomepageHeading mobile={true} authenticatedUser={authenticatedUser} />
            </Segment>

            {children}
        </Media>
    );
};

const ResponsiveContainer: React.FC<IUserProps> = ({ children, authenticatedUser }) => (
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
                                        We Help Companies and Employees
                                    </Header>
                                    <p style={{ fontSize: '1.33em' }}>
                                        We can give your company superpowers to do things that they never thought possible. Let us delight your employees and
                                        empower your needs... through automatic algorithmic scheduling.
                                    </p>
                                    <Header as="h3" style={{ fontSize: '2em' }}>
                                        We Make Schedules That Are Perfect
                                    </Header>
                                    <p style={{ fontSize: '1.33em' }}>
                                        Yes thats right, you thought it was the stuff of dreams, but even schedules can be engineered to perfection.
                                    </p>
                                </Grid.Column>
                                <Grid.Column floated="right" width={6}>
                                    <Image rounded size="large" src={logo} />
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
                                    <p style={{ fontSize: '1.33em' }}>
                                        <Icon name={'user circle outline'} />
                                        <b>Harold C. Dobey</b> - Police Captain
                                    </p>
                                </Grid.Column>
                                <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                                    <Header as="h3" style={{ fontSize: '2em' }}>
                                        I should not have gone with their competitor.
                                    </Header>
                                    <p style={{ fontSize: '1.33em' }}>
                                        <Icon name={'user circle'} />
                                        <b>David Michael Starsky</b> - Police Detective
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
                                Instead of focusing on manual calculations and hard work, we have learned how to master the art of the user doing nothing and
                                getting lots in return! By using massive amounts of artificial intelligence algorithms we will definitely be worth of your
                                attention.
                            </p>
                            <Divider as="h4" className="header" horizontal style={{ margin: '3em 0em', textTransform: 'uppercase' }}>
                                Case Studies
                            </Divider>

                            <Header as="h3" style={{ fontSize: '2em' }}>
                                Save Your Precious Time!
                            </Header>
                            <p style={{ fontSize: '1.33em' }}>
                                Yes I know you probably disregarded the earlier boasts as non-sequitur filler content, but it is really true. It took years of
                                research, but our scheduling methods really are engineered with the finest programming code.
                            </p>
                        </Container>
                    </Segment>

                    <Segment inverted vertical style={{ padding: '5em 0em' }}>
                        <Container>
                            <Header as="h4" inverted>
                                Starsky Scheduling Management
                            </Header>
                            <p>
                                Made with <Icon name={'heart'} />
                                by <a href={'https://github.com/peroxy'}>peroxy</a>.
                            </p>
                            <p>
                                <Icon name={'github'} /> This is an open-source project, check us out on
                                <a href={'https://github.com/peroxy/starsky-backend'}> GitHub</a>!
                            </p>
                        </Container>
                    </Segment>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
export default HomePage;
