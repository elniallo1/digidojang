import * as Ipfs from "ipfs";
import * as React from "react";
import CircularProgress from 'material-ui/Progress/CircularProgress';
import RaisedButton from 'material-ui/Button'
import "./dojang.css"

// tslint:disable:interface-name  no-empty-interface
interface CameraProps { ipfs: Ipfs; nfc: Nfc; }
interface CameraState {
    cameraUrl?: string;
    fileHash: Ipfs.IPFSFile[];
    isLoading: boolean;
    isUploading: boolean;
}
// tslint:enable:interface-name no-empty-interface

const toBuffer = require("blob-to-buffer");
const crypto2 = require("crypto-browserify");
import * as crypto from "crypto";
import { Nfc } from "./nfc";

const algorithm = "aes-256-ctr";
const password = "d6F3Efeq";

export class Camera extends React.Component<CameraProps, CameraState> {
    public mediaRequested: boolean;
    public ipfs: Ipfs;
    public blob?: Blob;

    constructor(props: CameraProps) {
        super(props);
        this.ipfs = props.ipfs;
        this.state = { fileHash: [], isLoading: false, isUploading: false };
        this.mediaRequested = false;
    }

    public componentWillMount() {
        if (!this.mediaRequested) {
            this.mediaRequested = true;
            const constraints = { audio: false, video: true, facingMode: "enviroment" };
            navigator.getUserMedia(
                constraints,
                this.userMedia.bind(this),
                this.error.bind(this),
            );
        }
    }

    public userMedia(stream: MediaStream) {
        this.setState({
            cameraUrl: window.URL.createObjectURL(stream),
        });
    }

    public error(error: MediaStreamError) {
        this.mediaRequested = false;
        console.log(error);
    }

    public render() {
        return (
            <div>
                <video src={this.state.cameraUrl} autoPlay />
                <canvas></canvas>
                <br />
                <RaisedButton onClick={this.capture.bind(this)} className="buttonTake" >Capture</RaisedButton>
                {this.state.isLoading && this.state.isUploading ? <CircularProgress className="circularBar" size={50} thickness={2} /> :
                    <RaisedButton onClick={this.send.bind(this)} className="buttonSend">Send</RaisedButton>}
                <ol>
                    {this.state.fileHash.map((f) => <li>{f.hash}</li>)}
                </ol>
                <br />
            </div >
        );
    }

    public send() {
        if (this.blob !== undefined) {
            console.log("rblob defined");
            this.setState({
                isLoading: true
            })
            const buffer = toBuffer(this.blob, this.processBuffer.bind(this));
        } else {
            console.log("this.state.fileToSend is undefined");
        }
    }

    public capture(): Promise<Blob> {
        const video = document.querySelector("video");
        const canvas = document.querySelector("canvas");
        if (canvas != null && video != null) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx != null) {
                ctx.drawImage(video, 0, 0);
                return new Promise<Blob>((resolve, reject) => {
                    canvas.toBlob((blob) => {
                        if (blob) {
                            this.blob = blob;
                            resolve(blob);
                        } else {
                            reject("Failed to get blob from camera canvas");
                        }
                    }, "image/png", 1.0);
                });
            }
            return Promise.reject("Could not get canvas context");
        }
        return Promise.reject("Could not find required elements, video and/or canvas.");
    }

    private async processBuffer(error: Error, buffer: Buffer) {
        if (error) { throw error; }
        console.log("Buffer: ");
        console.log(buffer);

        const encrypted = encrypt(buffer);
        console.log("Encrypt and decrypt : ");
        console.log(encrypted.buffer);
        console.log(decrypt(encrypted));

        const abc = crypto.createHash("sha256").update(encrypted).digest();
        console.log("Hash : ");
        console.log(abc);

        // send abc to ipfs
        const hash = await this.ipfs.files.add(encrypted);
        this.setState({ fileHash: hash, isLoading: true, isUploading: true });
        console.log(`http://dojang.glosfer.com:8080/ipfs/${hash[0].hash}`)
        fetch(`https://ipfs.io/ipfs/${hash[0].hash}`).then(this.startFetch.bind(this));
        this.props.nfc.push(hash[0].hash).then(() => {
            this.setState({
                isLoading: false
            })
        }
        )

    }

    private startFetch() {
        this.setState({ isUploading: false })
    }
}



function encrypt(buffer: Buffer) {
    const cipher = crypto.createCipher(algorithm, password);
    const crypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return crypted;
}

function decrypt(buffer: Buffer) {
    const decipher = crypto.createDecipher(algorithm, password);
    const dec = Buffer.concat([decipher.update(buffer), decipher.final()]);
    return dec;
}
