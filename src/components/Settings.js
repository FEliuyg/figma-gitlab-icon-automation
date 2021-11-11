import React, { useEffect, useState } from "react";
export default function Settings({ visible, gitlabData = {}, onGitlabSet, }) {
    const [_gitlabData, setGitlabData] = useState(gitlabData);
    const [warning, setWarning] = useState("");
    useEffect(() => {
        setGitlabData(gitlabData);
    }, [gitlabData]);
    const handleChange = (e) => {
        setGitlabData((prev) => (Object.assign(Object.assign({}, prev), { [e.target.name]: e.target.value })));
    };
    const handleSubmit = (e) => {
        if (!_gitlabData.domain) {
            setWarning("GitLab Domain is required.");
        }
        else if (!_gitlabData.projectId) {
            setWarning("GitLab Project ID is required.");
        }
        else if (!_gitlabData.token) {
            setWarning("GitLab Token is required.");
        }
        else {
            parent.postMessage({ pluginMessage: { type: "setGitlabData", gitlabData } }, "*");
            onGitlabSet(gitlabData);
        }
    };
    return (React.createElement("div", { className: !visible ? "hide" : "" },
        React.createElement("div", { className: "onboarding-tip" },
            React.createElement("div", { className: "onboarding-tip__icon" },
                React.createElement("div", { className: "icon icon--smiley" })),
            React.createElement("div", { className: "onboarding-tip__msg" }, "Hi, Welcome here. This plugin helps you convert icons to react component and publish to NPM. It should be used with Gitlab and NPM.")),
        warning && (React.createElement("div", { className: "form-item" },
            React.createElement("div", { className: "type type--pos-medium-normal alert alert-warning" }, warning))),
        React.createElement("div", { className: "form-item" },
            React.createElement("input", { name: "domain", className: "input", placeholder: "GitLab Domain", onChange: handleChange, value: _gitlabData === null || _gitlabData === void 0 ? void 0 : _gitlabData.domain })),
        React.createElement("div", { className: "form-item" },
            React.createElement("input", { name: "projectId", className: "input", placeholder: "Project ID", onChange: handleChange, value: _gitlabData === null || _gitlabData === void 0 ? void 0 : _gitlabData.projectId })),
        React.createElement("div", { className: "form-item" },
            React.createElement("input", { name: "token", className: "input", placeholder: "GitLab Token", onChange: handleChange, value: _gitlabData === null || _gitlabData === void 0 ? void 0 : _gitlabData.token })),
        React.createElement("div", { className: "form-item" },
            React.createElement("button", { className: "button button--primary button-block", onClick: handleSubmit }, _gitlabData ? "Update" : "Go"))));
}
