var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import React from "react";
import Webhook from "./Webhook";
import {
  getContent,
  updatePackage,
  createMergeRequest,
  createBranch,
} from "../../api/gitlab";
import { sendNotification } from "../../api/webhook";
import { versionValue } from "../../utils/helper";
export default class Settings extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      isPushing: false,
      version: "",
      message: "",
      versionTip: "",
      messageTip: "",
      contents: { version: "0.0.0" },
      currentVersion: "",
      currentVersionTip: "",
      resultTip: "",
      prUrl: "",
      isSending: false,
      webhookData: null,
    };
    this.getVersion = (gitlabData) =>
      __awaiter(this, void 0, void 0, function* () {
        const contents = yield getContent("package.json", gitlabData);
        console.log("contents", contents);
        const currentVersion = contents.version;
        this.setState({
          contents,
          currentVersion,
          currentVersionTip: `The current version is ${currentVersion}`,
        });
      });
    this.createBranch = () =>
      __awaiter(this, void 0, void 0, function* () {
        const { gitlabData } = this.props;
        const { ref } = yield createBranch(gitlabData);
        return { branchName: ref.replace("refs/heads/", "") };
      });
    this.changeVersion = (branch) =>
      __awaiter(this, void 0, void 0, function* () {
        const { gitlabData } = this.props;
        const { version, message, contents } = this.state;
        contents.version = version;
        yield updatePackage(message, contents, branch, gitlabData);
      });
    this.createCommitAndPR = (branchName) =>
      __awaiter(this, void 0, void 0, function* () {
        const { gitlabData } = this.props;
        const { version, message } = this.state;
        return yield createMergeRequest(
          `[figma]:update to ${version}`,
          message,
          branchName,
          gitlabData
        );
      });
    this.handleChange = (e) => {
      const { name, value } = e.target;
      this.setState({ [name]: value });
    };
    this.handleWebhookFilled = (webhookUrl, data) => {
      const noData = !webhookUrl && !data;
      this.setState({
        webhookData: noData ? null : { webhookUrl, data },
      });
    };
    this.validate = (callback) => {
      const { version, message, currentVersion } = this.state;
      // TODO: should validate async
      // this.getVersion(this.props.gitlabData)
      //   .then(() => {
      //     const { currentVersion } = this.state
      //     currentVersion
      //   })
      if (!version) {
        this.setState({ versionTip: "Version is required." });
        return;
      } else if (!/^[0-9]\d?(\.(0|[1-9]\d?)){2}$/.test(version)) {
        this.setState({ versionTip: "Version should be like 1.17.2." });
        return;
      } else if (versionValue(version) - versionValue(currentVersion) <= 0) {
        this.setState({ versionTip: "Should be bigger than current version." });
        return;
      }
      this.setState({
        versionTip: "",
      });
      if (!message) {
        this.setState({ messageTip: "Commit message is required." });
        return;
      }
      this.setState({
        messageTip: "",
      });
      callback && callback();
    };
    this.handleSubmit = () =>
      __awaiter(this, void 0, void 0, function* () {
        this.validate(() =>
          __awaiter(this, void 0, void 0, function* () {
            this.setState({ isPushing: true });
            const { branchName } = yield this.createBranch();
            yield this.changeVersion(branchName);
            const { html_url } = yield this.createCommitAndPR(branchName);
            const { version, message, webhookData } = this.state;
            this.setState({
              version: "",
              message: "",
              isPushing: false,
              resultTip:
                "Pushing successfully! You can now go to GitLab and merge this PR. Then your icons will be published to NPM automatically.",
              prUrl: html_url,
            });
            console.log(version, message);
            if (webhookData) {
              this.setState({ isSending: true });
              yield sendNotification(webhookData, html_url, version, message);
              this.setState({ isSending: false });
            }
          })
        );
      });
    this.onCancel = () => {
      parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
    };
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.gitlabData && this.props.gitlabData) {
      this.getVersion(this.props.gitlabData);
    }
  }
  render() {
    const { visible, webhookData } = this.props;
    const {
      isPushing,
      version,
      message,
      versionTip,
      messageTip,
      currentVersionTip,
      resultTip,
      prUrl,
      webhookData: whd,
      isSending,
    } = this.state;
    return React.createElement(
      "div",
      { className: "updator " + (!visible ? "hide" : "") },
      React.createElement(
        "div",
        { className: "form-item" },
        !resultTip &&
          React.createElement(
            "p",
            { className: "type type--pos-medium-normal" },
            "Please fill the version and commit message below."
          ),
        currentVersionTip &&
          !resultTip &&
          React.createElement(
            "div",
            { className: "type type--pos-medium-bold" },
            currentVersionTip
          ),
        resultTip &&
          React.createElement(
            "div",
            { className: "type type--pos-medium-bold alert alert-success" },
            React.createElement("h3", null, "Congratulations!"),
            resultTip,
            React.createElement("br", null),
            "Click",
            " ",
            React.createElement("a", { href: prUrl, target: "_blank" }, "here"),
            " ",
            "to open the PR link."
          ),
        whd &&
          isSending &&
          React.createElement(
            "p",
            { className: "type type--pos-medium-normal" },
            "Sending notification, please wait for a minute\u2026\u2026"
          )
      ),
      React.createElement(
        "div",
        { className: "form-item " + (resultTip ? "hide" : "") },
        React.createElement("input", {
          name: "version",
          className: "input",
          placeholder: "The new version, such as 1.17.2",
          onChange: this.handleChange,
          value: version,
        }),
        versionTip &&
          React.createElement(
            "div",
            { className: "type type--pos-medium-normal help-tip" },
            versionTip
          )
      ),
      React.createElement(
        "div",
        { className: "form-item " + (resultTip ? "hide" : "") },
        React.createElement("textarea", {
          rows: 2,
          name: "message",
          className: "textarea",
          placeholder: "what has been changed?",
          onChange: this.handleChange,
          value: message,
        }),
        messageTip &&
          React.createElement(
            "div",
            { className: "type type--pos-medium-normal help-tip" },
            messageTip
          )
      ),
      React.createElement(Webhook, {
        hidden: resultTip,
        onFilled: this.handleWebhookFilled,
        webhookData: webhookData,
      }),
      React.createElement(
        "div",
        { className: "form-item " + (resultTip ? "hide" : "") },
        React.createElement(
          "button",
          {
            onClick: this.handleSubmit,
            className: "button button--primary",
            style: { marginRight: "8px" },
            disabled: isPushing,
          },
          isPushing ? "pushing…" : "push to GitLab"
        ),
        !isPushing &&
          React.createElement(
            "button",
            { onClick: this.onCancel, className: "button button--secondary" },
            "close"
          )
      ),
      resultTip &&
        React.createElement(
          "button",
          { onClick: this.onCancel, className: "button button--secondary" },
          "close"
        )
    );
  }
}
