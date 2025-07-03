export enum EBlockEvents {
    INIT = 'init',
    FLOW_CDM = 'flow:component-did-mount',
    FLOW_CDU = 'flow:component-did-update',
    FLOW_RENDER = 'flow:render',

    STORE_CHANGED = 'store:changed',
    UPDATED = 'store:updated',
};

export enum EStoreEvents {
    STORE_CHANGED = 'store:changed',
    UPDATED = 'store:updated',
};

export enum EChatMessagesEvents {
    MESSAGE_SENT = 'message:sent',
    MESSAGE_RECEIVED = 'message:received',
    MESSAGE_SELECTED_NEW_CHAT = 'message:selected-new-chat',
    SHOULD_INITIATE_NEW_WEBSOCKET_CONNECTION = 'should-initiate-new-websocket-connection',
    MESSAGE_NEW_CONNECTION_ESTABLISHED = 'message:new-connection-established',
    WEBSOCKET_CONNECTION_OPENED = 'websocket:connection-opened',
};

