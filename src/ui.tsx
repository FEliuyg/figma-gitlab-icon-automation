import * as React from "react";
import * as ReactDOM from "react-dom";
import Settings from "./components/Settings";
import Updator from "./components/Updator";
import "../assets/ds.css";
import "./style.css";

class App extends React.Component {
  state = {
    updatorVisible: false,
    gitlabData: null,
    webhookData: null,
    settingSwitch: false,
    isDone: false,
  };
  onSucceed = () => {
    this.setState({ isDone: true });
  };
  toggleView = (gitlabData?) => {
    const { updatorVisible } = this.state;
    this.setState({ updatorVisible: !updatorVisible });
    if (gitlabData === true) {
      const { settingSwitch } = this.state;
      this.setState({ settingSwitch: !settingSwitch });
    } else if (gitlabData) {
      this.setState({
        gitlabData,
      });
    }
  };
  componentDidMount() {
    // receive messages here
    window.onmessage = async (event) => {
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
    };
  }
  render() {
    const {
      updatorVisible,
      gitlabData,
      webhookData,
      settingSwitch,
      isDone,
    } = this.state;
    const tabVisible = gitlabData && !isDone;
    return (
      <div className={"container " + (!tabVisible ? "" : "container-with-tab")}>
        <div className={"bar-adjust " + (tabVisible ? "" : "hide")}>
          <div
            className={
              "adjust-item type type--pos-medium-bold " +
              (updatorVisible ? "" : "active")
            }
            onClick={(e) => this.toggleView()}
          >
            Setting
          </div>
          <div
            className={
              "adjust-item type type--pos-medium-bold " +
              (updatorVisible ? "active" : "")
            }
            onClick={(e) => this.toggleView(true)}
          >
            Publish
          </div>
        </div>
        <Settings
          visible={!updatorVisible}
          gitlabData={gitlabData}
          onGitlabSet={this.toggleView}
          settingSwitch={settingSwitch}
        />
        <Updator
          onSucceed={this.onSucceed}
          visible={updatorVisible}
          gitlabData={gitlabData}
          webhookData={webhookData}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("react-page"));
