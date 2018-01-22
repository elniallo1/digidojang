import * as React from "react"
import * as ReactDOM from "react-dom"

import { Dojang } from "./dojang";


window.onload = (e) => {
    ReactDOM.render(
        <Dojang />,
        document.body
    )
}
