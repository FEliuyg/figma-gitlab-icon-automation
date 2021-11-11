var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from "react";
import ReactDOM from "react-dom";
import Settings from "./components/Settings";
import Updator from "./components/Updator";
import "../assets/ds.css";
import "./style.css";
class App extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            updatorVisible: false,
            gitlabData: null,
            webhookData: null,
            settingSwitch: false,
            isDone: false,
        };
        this.onSucceed = () => {
            this.setState({ isDone: true });
        };
        this.toggleView = (gitlabData) => {
            const { updatorVisible } = this.state;
            this.setState({ updatorVisible: !updatorVisible });
            if (gitlabData === true) {
                const { settingSwitch } = this.state;
                this.setState({ settingSwitch: !settingSwitch });
            }
            else if (gitlabData) {
                this.setState({
                    gitlabData,
                });
            }
        };
    }
    componentDidMount() {
        // receive messages here
        window.onmessage = (event) => __awaiter(this, void 0, void 0, function* () {
            const msg = event.data.pluginMessage;
            switch (msg.type) {
                case "gitlabDataGot":
                    if (msg.gitlabData) {
                        this.setState({
                            updatorVisible: true,
                            gitlabData: msg.gitlabData,
                        });
                    }
                    break;
                case "webhookDataGot":
                    if (msg.webhookData) {
                        this.setState({
                            webhookData: msg.webhookData,
                        });
                    }
                    break;
            }
        });
    }
    render() {
        const { updatorVisible, gitlabData, webhookData, settingSwitch, isDone } = this.state;
        const tabVisible = gitlabData && !isDone;
        return (React.createElement("div", { className: "container " + (!tabVisible ? "" : "container-with-tab") },
            React.createElement("div", { className: "bar-adjust " + (tabVisible ? "" : "hide") },
                React.createElement("div", { className: "adjust-item type type--pos-medium-bold " +
                        (updatorVisible ? "" : "active"), onClick: (e) => this.toggleView() }, "Setting"),
                React.createElement("div", { className: "adjust-item type type--pos-medium-bold " +
                        (updatorVisible ? "active" : ""), onClick: (e) => this.toggleView(true) }, "Publish")),
            React.createElement(Settings, { visible: !updatorVisible, gitlabData: gitlabData, onGitlabSet: this.toggleView, settingSwitch: settingSwitch }),
            React.createElement(Updator, { onSucceed: this.onSucceed, visible: updatorVisible, gitlabData: gitlabData, webhookData: webhookData })));
    }
}
ReactDOM.render(React.createElement(App, null), document.getElementById("react-page"));
