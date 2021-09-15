
import Channel = require('chnl');
import Options = require('./options');

export = WebSocketAsPromised;

declare class WebSocketAsPromised<T = void> {
    constructor(url: string, options?: Options<T>);
    ws: WebSocket;
    isOpening: boolean;
    isOpened: boolean;
    isClosing: boolean;
    isClosed: boolean;
    onOpen: Channel;
    onSend: Channel;
    onMessage: Channel;
    onUnpackedMessage: Channel;
    onRequest: Channel;
    onResponse: Channel;
    onClose: Channel;
    onError: Channel;
    onUpgrade: Channel;
    onPing: Channel;
    open: () => Promise<Event>;
    sendRequest: (data: any, options?: RequestOptions<T>) => Promise<any>;
    sendPacked: (data: any) => void;
    send: (data: string | ArrayBuffer | Blob) => void;
    waitUnpackedMessage: (predicate: (data: any) => boolean, options?: WaitUnpackedMessageOptions) => Promise<any>
    close: () => Promise<CloseEvent>;
    removeAllListeners: () => void;
}

declare interface RequestOptions<T> {
    requestId?: string | number;
    requestMetadata?: T;
    timeout?: number;
}

declare interface WaitUnpackedMessageOptions {
    timeout?: number;
    timeoutError?: Error;
}
