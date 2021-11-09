import * as React from 'react';
export default ({ hidden, onFilled, webhookData }) => {
    const [visible, setVisible] = React.useState(false);
    const [webhookUrl, setWebhookUrl] = React.useState('');
    const [data, setData] = React.useState('');
    const toggle = e => {
        setVisible(e.target.checked);
    };
    const handleChange = e => {
        const { value, name } = e.target;
        name === 'webhookUrl' ? setWebhookUrl(value) : setData(value);
    };
    React.useEffect(() => {
        if (!visible) {
            onFilled();
            parent.postMessage({ pluginMessage: { type: 'setWebhookData', webhookData: '' } }, '*');
        }
        if (visible && webhookUrl && data) {
            onFilled(webhookUrl, data);
            parent.postMessage({ pluginMessage: { type: 'setWebhookData', webhookData: { webhookUrl, data } } }, '*');
        }
    }, [visible, webhookUrl, data]);
    React.useEffect(() => {
        const { webhookUrl: url, data: message } = webhookData || { webhookUrl: '', data: '' };
        if (url && message) {
            setVisible(true);
            setWebhookUrl(url);
            setData(message);
        }
    }, [webhookData]);
    return (!hidden &&
        React.createElement(React.Fragment, null,
            React.createElement("div", { className: "checkbox" },
                React.createElement("input", { id: "visible", type: "checkbox", className: "checkbox__box", onChange: toggle, checked: visible }),
                React.createElement("label", { htmlFor: "visible", className: "checkbox__label" }, "Send a message to Slack/Lark")),
            React.createElement("div", { className: visible ? '' : 'hide' },
                React.createElement("div", { className: "form-item" },
                    React.createElement("input", { name: "webhookUrl", className: "input", placeholder: "Webhook link", value: webhookUrl, onChange: handleChange })),
                React.createElement("div", { className: "form-item" },
                    React.createElement("textarea", { rows: 2, name: "data", className: "textarea", placeholder: "Message data (json)", value: data, onChange: handleChange }),
                    React.createElement("div", { className: "type type--pos-medium-normal" }, "You can use variables $prUrl, $version, $message in the content.")))));
};
