import * as Ipfs from "ipfs";
import * as React from "react";
import { Nfc, NFCMessage } from "./nfc";

// tslint:disable:interface-name no-empty-interface
interface VerifyProps {
    ipfs: Ipfs;
    nfc: Nfc;
}
interface VerifyState {
    nfc: string[];
}
// tslint:enable:interface-name no-empty-interface

export class Verify extends React.Component<VerifyProps, VerifyState> {
    public nfc?: Nfc;
    public ipfs: Ipfs;

    constructor(props: VerifyProps) {
        super(props);
        this.nfc = this.props.nfc;
        this.state = { nfc: [] };
    }

    public componentWillMount() {
        if (this.nfc) {
            this.nfc.watch(this.nfcWatch.bind(this), { recordType: "text" });
        }
    }

    public componentWillUnmount() {
        if (this.nfc) {
            this.nfc.cancelWatch();
        }
    }

    public render() {
        return (
            <div>
                {this.renderNfcReady()}
                {this.renderNfcStrings()}
            </div>
        );
    }

    private renderNfcReady() {
        if (this.nfc) {
            return <h1>NFC is ready</h1>;
        } else {
            return <h1>NFC is not available</h1>;
        }
    }

    private renderNfcStrings() {
        return (
            <ol>
                {this.state.nfc.map((s) => (<li>{s}</li>))}
            </ol>
        );
    }

    private nfcWatch(message: NFCMessage<any>) {
        const strings: string[] = [];
        for (const record of message.records) {
            if (record.recordType === "text") {
                strings.push(record.data);
            }
        }
        this.setState({ nfc: strings });
    }

    private nfcWrite() {
        console.log(`Wrote '${this.props.ipfsId}' to tag`);
    }
}
