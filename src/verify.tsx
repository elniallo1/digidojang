import * as Ipfs from "ipfs";
import * as React from "react";
import { Nfc, NFCMessage } from "./nfc";

// tslint:disable:interface-name no-empty-interface
interface VerifyProps {
    ipfsId?: string;
}
interface VerifyState {
    nfc: string[];
}
// tslint:enable:interface-name no-empty-interface

export class Verify extends React.Component<VerifyProps, VerifyState> {

    public nfc?: Nfc;
    constructor(props: VerifyProps) {
        super(props);
        const nav: any = navigator;
        this.nfc = nav.nfc;
        this.state = { nfc: [] };
    }

    public componentWillReceiveProps() {
        if (this.nfc) {
            this.nfc.cancelPush();
        }
    }

    public shouldComponentUpdate(): boolean {
        if (this.nfc && this.props.ipfsId) {
            this.nfc.push(this.props.ipfsId);
        }
        return true;
    }

    public componentWillMount() {
        if (this.nfc) {
            this.nfc.watch(this.nfcWatch.bind(this), { recordType: "text" });
            if (this.props.ipfsId) {
                this.nfc.push(this.props.ipfsId);
            }
        }
    }

    public componentWillUnmount() {
        if (this.nfc) {
            this.nfc.cancelWatch();
            this.nfc.cancelPush();
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
