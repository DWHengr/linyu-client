import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import {BrowserRouter as Router} from "react-router-dom";
import "./assets/iconfont.css"
import {Provider} from "react-redux";
import Store from "./store/index.jsx";
import ToastProvider from "./componets/CustomToast/index.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={Store}>
        <ToastProvider>
            <Router>
                <App/>
            </Router>
        </ToastProvider>
    </Provider>
);
