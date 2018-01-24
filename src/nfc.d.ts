


interface NFCMessage<T> {
    records: NFCRecord<T>[];
    url: USVString;
}

type _NFCRecord<T, M, D> = {
    recordType: T;
    data: D;
    mediaType: M;
}

type NFCRecordType = (
    "empty" |
    "text" |
    "url" |
    "json" |
    "opaque"
);

export type NFCRecord<T> = (
    _NFCRecord<"empty", void, void> |
    _NFCRecord<"text", void, string> |
    _NFCRecord<"url", void, string> |
    _NFCRecord<"json", USVString, T> |
    _NFCRecord<"opaque", USVString, ArrayBuffer> |
    _NFCRecord<"opaque", "", ArrayBuffer>
)

type NFCPushMessage<T> = (string | ArrayBuffer | NFCMessage<T>);


type NFCPushTarget = (
    "tag" |
    "peer" |
    "any"
)

declare interface NFCPushOptions {
    target?: NFCPushTarget
    timeout?: number
    ignoreRead?: boolean
}

type MessageCallback = (message: NFCMessage<any>) => void;

type NFCWatchMode = (
    "web-nfc-only" |
    "any"
);

interface NFCWatchOptions {
    url?: USVString;
    recordType?: NFCRecordType;
    mediaType?: USVString;
    mode?: NFCWatchMode;
}

declare interface Nfc {
    push<T=any>(message: NFCPushMessage<T>, options?: NFCPushOptions): Promise<void>;
    cancelPush(target?: NFCPushTarget): Promise<void>;
    watch(callback: MessageCallback, options?: NFCWatchOptions): Promise<number>;
    cancelWatch(id?: number): Promise<void>;
}
