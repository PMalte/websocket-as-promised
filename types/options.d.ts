
export = Options;

declare interface Options<T> {
    createWebSocket?: (url: string) => WebSocket;
    packMessage?: (data: any) => string | ArrayBuffer | Blob;
    unpackMessage?: (data: string | ArrayBuffer | Blob) => any;
    attachRequestId?: (data: any, requestId: string | number) => any;
    extractRequestId?: (data: any) => string | number | undefined;
    extractMessageData?: (event: any) => any;
    isPossibleResponse?: (data: any, metaData: T) => boolean;
    timeout?: number;
    connectionTimeout?: number;
}
