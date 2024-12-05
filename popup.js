// popup.js

document.getElementById('save').addEventListener('click', () => {
    let apiKey = document.getElementById('apiKey').value;
    let enabled = document.getElementById('enableExtension').checked;
    chrome.storage.local.set({
        openai_api_key: apiKey,
        extension_enabled: enabled
    }, () => {
        document.getElementById('status').textContent = 'Settings saved.';
        setTimeout(() => {
            document.getElementById('status').textContent = '';
        }, 2000);
    });
});

// Load the saved settings when the popup is opened
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['openai_api_key', 'extension_enabled'], data => {
        if (data.openai_api_key) {
            document.getElementById('apiKey').value = data.openai_api_key;
        }
        if (data.extension_enabled !== undefined) {
            document.getElementById('enableExtension').checked = data.extension_enabled;
        } else {
            document.getElementById('enableExtension').checked = true; // Default to enabled
        }
    });
});
