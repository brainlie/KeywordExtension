// popup.js

document.getElementById('save').addEventListener('click', () => {
    let apiKey = document.getElementById('apiKey').value;
    chrome.storage.local.set({ openai_api_key: apiKey }, () => {
        document.getElementById('status').textContent = 'API Key saved.';
    });
});

// Load the saved API key when the popup is opened
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get('openai_api_key', data => {
        if (data.openai_api_key) {
            document.getElementById('apiKey').value = data.openai_api_key;
        }
    });
});
