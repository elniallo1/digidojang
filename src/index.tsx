import * as React from "react";
import * as ReactDOM from "react-dom";

import { Dojang } from "./dojang";
import { Menu } from "./menu";
import "./dojang.css"


window.onload = (e) => {
    ReactDOM.render(
        <Menu />,
        document.body,
    );
};