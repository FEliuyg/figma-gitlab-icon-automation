figma.showUI(__html__, { width: 320, height: 436 });

// get settings
function getLocalData(key: string) {
  return figma.clientStorage.getAsync(key);
}

// set settings
function setLocalData<T = any>(key: string, data: T) {
  return figma.clientStorage.setAsync(key, data);
}

// send data to UI
function init() {
  getLocalData("githubData").then((githubData) => {
    figma.ui.postMessage({ type: "githubDataGot", githubData });
  });
  getLocalData("webhookData").then((webhookData) => {
    figma.ui.postMessage({ type: "webhookDataGot", webhookData });
  });
}

figma.ui.onmessage = (msg) => {
  switch (msg.type) {
    case "setGitlabData":
      setLocalData("githlabData", msg.gitlabData);
      break;
    case "setWebhookData":
      setLocalData("webhookData", msg.webhookData);
      break;
    case "cancel":
      figma.closePlugin();
      break;
  }
};

init();
