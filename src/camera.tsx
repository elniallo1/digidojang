import * as React from "react";

// tslint:disable:interface-name no-empty-interface
interface CameraProps { }
interface CameraState {
    cameraUrl?: string;
}
// tslint:enable:interface-name no-empty-interface

export class Camera extends React.Component<CameraProps, CameraState> {
    public mediaRequested: boolean;

    constructor(props: CameraProps) {
        super(props);
        this.state = {};
        this.mediaRequested = false;
    }

    public componentWillMount() {
        if (!this.mediaRequested) {
            this.mediaRequested = true;
            const constraints = { audio: false, video: true, facingMode: "rear" };
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
                <button onClick={this.capture}>Capture</button>
                <br />
            </div >
        );
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
                            resolve(blob);
                        } else {
                            reject("Failed to get blob from camera canvas");
                        }
                    }, "image/png", 0.97);
                });
            }
            return Promise.reject("Could not get canvas context");
        }
        return Promise.reject("Could not find required elements, video and/or canvas.");
    }
}
