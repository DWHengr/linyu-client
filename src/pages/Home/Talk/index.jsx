import "./index.less"
import {Redirect, Route, Switch} from "react-router-dom";
import AllTalk from "./AllTalk/index.jsx";
import DetailTalk from "./DetailTalk/index.jsx";
import CreateTalk from "./CreateTalk/index.jsx";

export default function Talk() {

    return (
        <div className="talk-container">
            <Switch>
                <Route path="/home/talk/all" component={AllTalk}></Route>
                <Route path="/home/talk/detail" component={DetailTalk}></Route>
                <Route path="/home/talk/create" component={CreateTalk}></Route>
                <Redirect path="/home/talk" to="/home/talk/all"/>
            </Switch>
        </div>
    )
}