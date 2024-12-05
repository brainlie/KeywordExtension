// popup.js

document.addEventListener('DOMContentLoaded', () => {
    // Load the saved settings when the popup is opened
    chrome.storage.local.get(['openai_api_key', 'extension_enabled'], data => {
        document.getElementById('apiKey').value = data.openai_api_key || '';
        document.getElementById('enableExtension').checked = data.extension_enabled || false;
    });
});

document.getElementById('save').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value.trim();
    const enabled = document.getElementById('enableExtension').checked;
    chrome.storage.local.set({
        openai_api_key: apiKey,
        extension_enabled: enabled
    }, () => {
        document.getElementById('status').textContent = 'Settings saved.';
        setTimeout(() => {
            document.getElementById('status').textContent = '';
        }, 2000);

        // Send a message to the content script to update immediately
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'updateState' });
        });
    });
});
