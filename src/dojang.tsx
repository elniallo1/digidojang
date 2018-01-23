import { Errback } from "express";
import * as Ipfs from "ipfs";
import * as React from "react";
import { Camera } from "./camera";

// tslint:disable:interface-name no-empty-interface
interface DojangProps { }
interface DojangState {
    id?: string;
    files: Ipfs.IPFSFile[];
}
// tslint:enable:interface-name no-empty-interface

export class Dojang extends React.Component<DojangProps, DojangState> {
    public ipfs: Ipfs;

    constructor(props: DojangProps) {
        super(props);
        this.state = { files: [] };
    }

    public componentWillMount() {
        this.ipfs = new Ipfs({});
        this.ipfs.once("ready", this.ipfsReady.bind(this));
    }

    public render() {
        return (
            <div>
                <h1>Test</h1>
                {this.state.id === undefined ? <div>Connecting...</div> : <div>IPFS ID: {this.state.id}</div>}
                {this.state.files.map((file) => <div>File Hash: {file.hash}</div>)}
                <Camera />
            </div>
        );

    }

    private ipfsReady() {
        if (this.ipfs !== undefined) {
            this.setState({ id: "Waiting..." });
            this.ipfs.id({}, this.ipfsId.bind(this));
        }
        this.ipfs.files.add(Buffer.from("This is a test file."), this.ipfsFileAdd.bind(this));
    }

    private ipfsId(error: Error, res: Ipfs.Id) {
        if (error) {
            console.log(error);
        }
        this.setState({ id: res.id });
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
}
