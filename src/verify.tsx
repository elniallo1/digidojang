import * as Ipfs from "ipfs";
import * as React from "react";
import { Nfc, NFCMessage } from "./nfc";
import CircularProgress from 'material-ui/Progress/CircularProgress';

import "./dojang.css"

// tslint:disable:interface-name no-empty-interface
interface VerifyProps {
    ipfs: Ipfs;
    nfc: Nfc;
}
interface VerifyState {
    nfc: string[];
    displayImage?: string;
    isLoading: boolean;
}
// tslint:enable:interface-name no-empty-interface
import * as crypto from "crypto";
const algorithm = "aes-256-ctr";
const password = "d6F3Efeq";

export class Verify extends React.Component<VerifyProps, VerifyState> {
    public nfc?: Nfc;
    public ipfs: Ipfs;

    constructor(props: VerifyProps) {
        super(props);
        this.nfc = this.props.nfc;
        this.ipfs = this.props.ipfs
        this.state = { nfc: [], displayImage: "", isLoading: false };
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
                {this.state.isLoading ? <CircularProgress className="circularBar" size={50} thickness={2} /> :
                    <br />}
                {this.state.displayImage != "" ?
                    <img src={"data:image/png;base64," + this.state.displayImage} alt="Red dot" /> : <br />
                }

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

    private renderDocument() {
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
                const hash = record.data
                if (hash.charAt(0) == "Q" && hash.length > 20) {
                    console.log("Hash is sending to the ipfs : " + hash)
                    this.setState({
                        isLoading: true
                    })
                    this.ipfs.files.get(hash, this.file.bind(this))
                }
            }
        }
        this.setState({ nfc: strings });
    }

    private file(error: Error, result?: Ipfs.IPFSFile[]) {
        if (result != undefined && result.length > 0) {
            console.log(result)

            console.log(result[0].content)

            let x: any = result[0].content
            let decryptedBuffer = decrypt(x);
            console.log(decryptedBuffer)


            let str = decryptedBuffer.toString('base64')

            //console.log(str)

            this.setState({
                isLoading: false
            })

            this.setState({
                displayImage: str
            })
        }
    }



    private nfcWrite() {
    }
}

function decrypt(buffer: Buffer) {
    const decipher = crypto.createDecipher(algorithm, password);
    const dec = Buffer.concat([decipher.update(buffer), decipher.final()]);
    return dec;
}