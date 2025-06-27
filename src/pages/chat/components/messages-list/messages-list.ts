import Block from '../../../../core/block';
import { connect } from '../../../../core/store/connect';

type MessagesListProps = {

}

class MessagesList extends Block<MessagesListProps> {
    constructor(props: MessagesListProps) {
        super(
            'app-messages-list',
            { ...props },
        );
    }
}

export const mapStateToProps = (state: any) => {
    return {
        messages: state.messages,
    };
};

export const ConnectedMessagesList = connect(mapStateToProps)(MessagesList);
