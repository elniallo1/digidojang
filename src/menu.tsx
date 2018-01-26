import * as Ipfs from "ipfs";
import * as React from "react";
import { Camera } from "./camera";
import { Verify } from "./verify";
import { Nfc } from "./nfc";

import "./dojang.css"



export class Menu extends React.Component<any, any> {
    public ipfs: Ipfs;
    public nfc: Nfc

    constructor(props: any) {
        super(props);
        this.state = { files: [], choiceGet: false, choiceSend: false, enabledNFC: false };
        const nav: any = navigator
        this.nfc = nav.nfc
    }

    public componentWillMount() {
        this.ipfs = new Ipfs({});
        this.ipfs.once("ready", this.ipfsReady.bind(this));
    }

    public render() {
        return (
            <div>
                <h1>Menu</h1>
                <div>
                    {this.state.id === undefined ? <div>Connecting...</div> : <div>IPFS ID: {this.state.id}</div>}
                    <button className="buttonTake" onClick={this.goToSend.bind(this)} disabled={this.nfc === undefined}>Save document</button>
                    <button className="buttonTake" onClick={this.goToGet.bind(this)} disabled={this.nfc === undefined}>Get document</button>
                    <br />
                    {this.renderNfcReady()}
                </div>
                <div>
                    {this.state.choiceSend === true ? <Camera ipfs={this.ipfs} nfc={this.nfc} /> : <br />}
                    {this.state.choiceGet === true ? <Verify ipfs={this.ipfs} nfc={this.nfc} /> : <br />}
                </div>
            </div>
        );

    }

    private goToSend() {
        this.setState({
            choiceGet: false,
            choiceSend: true,
        })
    }

    private goToGet() {
        this.setState({
            choiceGet: true,
            choiceSend: false,
        })
    }

    private ipfsReady() {
        if (this.ipfs !== undefined) {
            this.setState({ id: "Waiting..." });
            this.ipfs.id({}, this.ipfsId.bind(this));
            this.ipfs.files.add(Buffer.from("This is a test file."), this.ipfsFileAdd.bind(this));
        }
    }

    private ipfsId(error: Error, res: Ipfs.Id) {
        if (error) {
            console.log(error);
        }
        if (res) {
            this.setState({ id: res.id });
        }
    }

    private ipfsFileAdd(error: Error, res: Ipfs.IPFSFile[]) {
        if (error) {
            console.log(error);
        }
        if (res) {
            this.setState({ files: res });
        }
    }

    private ipfsSwarmConnect(error: Error) {
        if (error) {
            console.log(error);
        } else {
            console.log("Connected");
        }
    }

    private renderNfcReady() {
        if (this.nfc) {
            return <h1></h1>;
        } else {
            return <h1>Please enable NFC, visit chrome://flags#enable-webnfc</h1>;
        }
    }
}
