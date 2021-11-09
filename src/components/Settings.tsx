import * as React from "react";
import { validateGitlabURL } from "../../utils/helper";

export interface Props {
  onGitlabSet?: (data) => void;
  gitlabData: { repoUrl?: string; projectId?: string; token?: string };
  visible: boolean;
  settingSwitch: boolean;
}

export default class Settings extends React.Component<Props> {
  state = {
    gitlabRepo: "",
    gitlabToken: "",
    warning: "",
  };
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleSubmit = (e) => {
    const { onGitlabSet } = this.props;
    const { gitlabRepo, gitlabToken } = this.state;
    const repo = validateGitlabURL(gitlabRepo);
    if (!repo) {
      this.setState({ warning: "GitLab Repository is required." });
    } else if (!repo.owner || !repo.name) {
      this.setState({ warning: "GitLab Repository URL is invalid." });
    } else if (!gitlabToken) {
      this.setState({ warning: "GitLab Token is required." });
    } else {
      const gitlabData = {
        repoUrl: repo.owner,
        projectId: repo.name,
        token: gitlabToken,
      };
      parent.postMessage(
        { pluginMessage: { type: "setGitlabData", gitlabData } },
        "*"
      );
      onGitlabSet(gitlabData);
    }
  };

  render() {
    const { visible, gitlabData } = this.props;
    const { gitlabRepo, gitlabToken, warning } = this.state;
    return (
      <div className={!visible ? "hide" : ""}>
        <div className="onboarding-tip">
          <div className="onboarding-tip__icon">
            <div className="icon icon--smiley"></div>
          </div>
          <div className="onboarding-tip__msg">
            Hi, Welcome here. This plugin helps you convert icons to react
            component and publish to NPM. It should be used with Gitlab and NPM.
          </div>
        </div>
        {warning && (
          <div className="form-item">
            <div className="type type--pos-medium-normal alert alert-warning">
              {warning}
            </div>
          </div>
        )}
        <div className="form-item">
          <input
            name="gitlabRepo"
            className="input"
            placeholder="GitLab Repository URL"
            onChange={this.handleChange}
            value={gitlabRepo}
          />
        </div>
        <div className="form-item">
          <input
            name="gitlabToken"
            className="input"
            placeholder="GitLab Token"
            onChange={this.handleChange}
            value={gitlabToken}
          />
        </div>
        <div className="form-item">
          <button
            className="button button--primary button-block"
            onClick={this.handleSubmit}
          >
            {gitlabData ? "Update" : "Go"}
          </button>
        </div>
      </div>
    );
  }
}
