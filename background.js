// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "processText") {
        chrome.storage.local.get('openai_api_key', data => {
            let apiKey = data.openai_api_key;
            if (!apiKey) {
                console.error('OpenAI API key not set.');
                sendResponse({});
                return;
            }

            let prompt = `Identify keywords in the provided text to enable efficient reading. Provide the keywords and list words that can be omitted without losing the meaning. Provide the response in JSON format with "keywords" and "omitted_words" as keys.

Text:
${request.text}`;

            // Make API call to OpenAI
            fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + apiKey
                },
                body: JSON.stringify({
                    "model": "gpt-3.5-turbo",
                    "messages": [{ "role": "user", "content": prompt }],
                    "temperature": 0.5
                })
            })
            .then(response => response.json())
            .then(data => {
                let reply = data.choices[0].message.content;

                // Parse the assistant's reply as JSON
                let jsonResponse;
                try {
                    jsonResponse = JSON.parse(reply);
                } catch (e) {
                    console.error('Error parsing JSON:', e);
                    jsonResponse = {};
                }

                sendResponse({ keywords: jsonResponse.keywords || [], omitted: jsonResponse.omitted_words || [] });
            })
            .catch(error => {
                console.error('Error:', error);
                sendResponse({});
            });
        });

        // Return true to indicate that we will send a response asynchronously
        return true;
    }
});
