import * as React from "react";
import { validateGithubURL } from "../../utils/helper";
export default class Settings extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            githubRepo: "",
            githubToken: "",
            warning: "",
        };
        this.handleChange = (e) => {
            this.setState({ [e.target.name]: e.target.value });
        };
        this.handleSubmit = (e) => {
            const { onGithubSet } = this.props;
            const { githubRepo, githubToken } = this.state;
            const repo = validateGithubURL(githubRepo);
            if (!repo) {
                this.setState({ warning: "GitLab Repository is required." });
            }
            else if (!repo.owner || !repo.name) {
                this.setState({ warning: "GitLab Repository URL is invalid." });
            }
            else if (!githubToken) {
                this.setState({ warning: "GitLab Token is required." });
            }
            else {
                const githubData = {
                    owner: repo.owner,
                    name: repo.name,
                    githubToken: `${githubToken}`,
                };
                parent.postMessage({ pluginMessage: { type: "setGithubData", githubData } }, "*");
                onGithubSet(githubData);
            }
        };
    }
    componentDidUpdate(prevPorps) {
        const { githubData, settingSwitch } = this.props;
        if ((!prevPorps.githubData && githubData) ||
            prevPorps.settingSwitch !== settingSwitch) {
            this.setState({
                githubRepo: `https://github.com/${githubData.owner}/${githubData.name}`,
                githubToken: githubData.githubToken,
            });
        }
    }
    render() {
        const { visible, githubData } = this.props;
        const { githubRepo, githubToken, warning } = this.state;
        return (React.createElement("div", { className: !visible ? "hide" : "" },
            React.createElement("div", { className: "onboarding-tip" },
                React.createElement("div", { className: "onboarding-tip__icon" },
                    React.createElement("div", { className: "icon icon--smiley" })),
                React.createElement("div", { className: "onboarding-tip__msg" }, "Hi, Welcome here. This plugin helps you convert icons to react component and publish to NPM. It should be used with Gitlab and NPM.")),
            warning && (React.createElement("div", { className: "form-item" },
                React.createElement("div", { className: "type type--pos-medium-normal alert alert-warning" }, warning))),
            React.createElement("div", { className: "form-item" },
                React.createElement("input", { name: "githubRepo", className: "input", placeholder: "GitLab Repository URL", onChange: this.handleChange, value: githubRepo })),
            React.createElement("div", { className: "form-item" },
                React.createElement("input", { name: "githubToken", className: "input", placeholder: "GitLab Token", onChange: this.handleChange, value: githubToken })),
            React.createElement("div", { className: "form-item" },
                React.createElement("button", { className: "button button--primary button-block", onClick: this.handleSubmit }, githubData ? "Update" : "Go"))));
    }
}
