import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import {BrowserRouter as Router} from "react-router-dom";
import "./assets/iconfont.css"

ReactDOM.createRoot(document.getElementById("root")).render(
    <Router>
        <App/>
    </Router>
);
