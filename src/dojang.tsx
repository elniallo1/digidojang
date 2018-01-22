import * as React from "react";
import { Camera } from "./camera";

// tslint:disable:interface-name no-empty-interface
interface DojangProps { }
interface DojangState { }
// tslint:enable:interface-name no-empty-interface

export class Dojang extends React.Component<DojangProps, DojangState> {
    constructor(props: DojangProps) {
        super(props);
        this.state = {};
    }

    public render() {
        return (
            <div>
                <h1>Test</h1>,
                <Camera />
            </div>
        );

    }
}
