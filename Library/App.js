import React from "react";
import ReactDOM from "react-dom";
import PlaygroundApp from "./Containers/PlaygroundApp";

import "../Styles/reset.css";
import "../Styles/interactive.scss";
import "codemirror/lib/codemirror.css"
import "codemirror/theme/monokai.css"
import "codemirror/theme/solarized.css"
import "font-awesome/css/font-awesome.css"
import "bootstrap/dist/css/bootstrap.css"

ReactDOM.render(
  <PlaygroundApp />,
  document.getElementById('root')
);
