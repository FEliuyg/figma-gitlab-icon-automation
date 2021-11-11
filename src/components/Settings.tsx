import React, { useEffect, useState } from "react";

export interface Props {
  onGitlabSet?: (data) => void;
  gitlabData: { domain?: string; projectId?: string; token?: string };
  visible: boolean;
  settingSwitch: boolean;
}

export default function Settings({
  visible,
  gitlabData = {},
  onGitlabSet,
}: Props) {
  const [_gitlabData, setGitlabData] = useState(gitlabData);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    setGitlabData(gitlabData);
  }, [gitlabData]);

  const handleChange = (e) => {
    setGitlabData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    if (!_gitlabData.domain) {
      setWarning("GitLab Domain is required.");
    } else if (!_gitlabData.projectId) {
      setWarning("GitLab Project ID is required.");
    } else if (!_gitlabData.token) {
      setWarning("GitLab Token is required.");
    } else {
      parent.postMessage(
        { pluginMessage: { type: "setGitlabData", gitlabData } },
        "*"
      );
      onGitlabSet(gitlabData);
    }
  };

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
          name="domain"
          className="input"
          placeholder="GitLab Domain"
          onChange={handleChange}
          value={_gitlabData?.domain}
        />
      </div>
      <div className="form-item">
        <input
          name="projectId"
          className="input"
          placeholder="Project ID"
          onChange={handleChange}
          value={_gitlabData?.projectId}
        />
      </div>
      <div className="form-item">
        <input
          name="token"
          className="input"
          placeholder="GitLab Token"
          onChange={handleChange}
          value={_gitlabData?.token}
        />
      </div>
      <div className="form-item">
        <button
          className="button button--primary button-block"
          onClick={handleSubmit}
        >
          {_gitlabData ? "Update" : "Go"}
        </button>
      </div>
    </div>
  );
}
