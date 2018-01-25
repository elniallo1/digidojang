import * as React from "react";
import * as ReactDOM from "react-dom";

import { Dojang } from "./dojang";
import { Menu } from "./menu";

window.onload = (e) => {
    ReactDOM.render(
        <Menu />,
        document.body,
    );
};
