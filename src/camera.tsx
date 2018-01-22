import * as React from "react";

// tslint:disable:interface-name no-empty-interface
interface CameraProps { }
interface CameraState {
    camera?: MediaStream;
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
        this.setState({ camera: stream, cameraUrl: window.URL.createObjectURL(stream) });
    }

    public error(error: MediaStreamError) {
        console.log(error);
    }

    public render() {
        return (
            <video src={this.state.cameraUrl} autoPlay />
        );

    }
}
