import 'react-app-polyfill/ie11';
import React from "react";
import ReactDOM from "react-dom";
import Root from "./Main";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import 'css/index.scss';
import 'anon/css/anon.index.scss';

ReactDOM.render(
    <Root />,
    document.getElementById("root_reactapp_anon")
);
