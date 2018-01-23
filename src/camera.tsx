import * as React from "react";

// tslint:disable:interface-name no-empty-interface
interface CameraProps { }
interface CameraState {
    camera?: MediaStream;
    width?: number;
    height?: number;
    cameraUrl?: string;
}
// tslint:enable:interface-name no-empty-interface

export class Camera extends React.Component<CameraProps, CameraState> {
    constructor(props: CameraProps) {
        super(props);
        this.state = {};
    }

    public componentWillMount() {
        navigator.getUserMedia(
            { audio: false, video: true },
            this.userMedia.bind(this),
            this.error.bind(this),
        );
    }

    public userMedia(stream: MediaStream) {
        let settings = stream.getTracks()[0].getSettings()

        this.setState({
            camera: stream,
            cameraUrl: window.URL.createObjectURL(stream),
            width: settings.width,
            height: settings.height
        });
    }

    public error(error: MediaStreamError) {
        console.log(error);
    }

    public render() {
        return (
            <div>
                <video src={this.state.cameraUrl} autoPlay />
                <br />
                <button onClick={this.capture}>Capture</button>
                <br />
                <img src=""></img>
                <br />
                <canvas width={this.state.width} height={this.state.height}></canvas>
            </div>
        );
    }

    public capture() {
        console.log("capture the video")
        var video = document.querySelector('video');
        var canvas = document.querySelector('canvas');
        if (canvas != null) {
            var ctx = canvas.getContext('2d');
            if (ctx != null && video != null) {
                ctx.drawImage(video, 0, 0);
                // "image/webp" works in Chrome.
                // Other browsers will fall back to image/png.
            }
        }

    }
}
