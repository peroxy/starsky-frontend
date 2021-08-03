import { Icon, Message } from 'semantic-ui-react';
import React from 'react';
import { MessageSizeProp } from 'semantic-ui-react/dist/commonjs/collections/Message/Message';

export interface ContentMissingProps {
    size?: MessageSizeProp;
    header: JSX.Element | string;
    content: JSX.Element | string;
}
export const ContentMissing: React.FC<ContentMissingProps> = (props: ContentMissingProps) => {
    return (
        <Message size={props.size ? props.size : 'large'} warning>
            <Message.Header>
                <Icon name={'bullhorn'} /> {props.header}
            </Message.Header>
            <Message.Content>{props.content}</Message.Content>
        </Message>
    );
};
