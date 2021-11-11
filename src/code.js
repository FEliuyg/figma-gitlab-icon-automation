figma.showUI(__html__, { width: 320, height: 436 });
// get settings
function getLocalData(key) {
    return figma.clientStorage.getAsync(key);
}
// set settings
function setLocalData(key, data) {
    return figma.clientStorage.setAsync(key, data);
}
// send data to UI
function init() {
    getLocalData("gitlabData").then((gitlabData) => {
        figma.ui.postMessage({ type: "gitlabDataGot", gitlabData });
    });
    getLocalData("webhookData").then((webhookData) => {
        figma.ui.postMessage({ type: "webhookDataGot", webhookData });
    });
}
figma.ui.onmessage = (msg) => {
    switch (msg.type) {
        case "setGitlabData":
            setLocalData("gitlabData", msg.gitlabData);
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
