export enum EBlockEvents {
	INIT = 'init',
	FLOW_CDM = 'flow:component-did-mount',
	FLOW_CDU = 'flow:component-did-update',
	FLOW_RENDER = 'flow:render',
};

export enum EStoreEvents {
	STORE_CHANGED = 'store:changed',
    UPDATED = 'store:updated',
};

export enum EChatEvents {
    MESSAGE_SENT = 'message:sent',
    MESSAGE_RECEIVED = 'message:received',
};

