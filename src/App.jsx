import "./App.css";
import {Redirect, Route, Switch} from "react-router-dom";
import Home from "./pages/Home/index.jsx";
import Login from "./pages/Login/index.jsx";
import TrayMenu from "./pages/TrayMenu/index.jsx";
import ChatWindow from "./pages/ChatWindow/index.jsx";
import MessageBox from "./pages/MessageBox/index.jsx";
import {useEffect} from "react";
import Screenshot from "./pages/screenshot/index.jsx";
import VideoChat from "./pages/VideoChat/index.jsx";

function App() {

    const ignoreKey = ["v", "a", "c", "z"];

    const onGlobalKeyDown = (e) => {
        if ((e.ctrlKey || e.altKey) && ignoreKey.indexOf(e.key) < 0) {
            e.preventDefault();
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", onGlobalKeyDown);
        return () => {
            window.removeEventListener("keydown", onGlobalKeyDown);
        };
    }, []);

    return (
        <div onContextMenu={(e) => e.preventDefault()}>
            <Switch>
                <Route path="/login" component={Login}></Route>
                <Route path="/home" component={Home}></Route>
                <Route path="/tray" component={TrayMenu}></Route>
                <Route path="/messagebox" component={MessageBox}></Route>
                <Route path="/chat" component={ChatWindow}></Route>
                <Route path="/screenshot" component={Screenshot}></Route>
                <Route path="/videochat" component={VideoChat}></Route>
                <Redirect path="/" to="/login"/>
            </Switch>
        </div>
    );
}

export default App;
