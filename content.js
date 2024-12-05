// content.js

// Function to extract text nodes from the page that are longer than 10 words
function getTextNodes() {
    let walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                // Exclude whitespace-only nodes
                if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                // Only accept nodes with more than 10 words
                if (node.nodeValue.trim().split(/\s+/).length >= 10) {
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_REJECT;
            }
        },
        false
    );

    let nodeList = [];
    let currentNode;
    while (currentNode = walker.nextNode()) {
        nodeList.push(currentNode);
    }
    return nodeList;
}

// Function to process the text nodes
function processTextNodes(textNodes) {
    textNodes.forEach(node => {
        let text = node.nodeValue.trim();
        // Send the text to background script for processing
        chrome.runtime.sendMessage({ action: "processText", text: text }, response => {
            if (response && response.keywords && response.omitted) {
                // Replace the text node with a span containing highlighted keywords and dimmed omitted words
                let newHTML = generateHighlightedText(text, response.keywords, response.omitted);
                let span = document.createElement('span');
                span.innerHTML = newHTML;
                node.parentNode.replaceChild(span, node);
            }
        });
    });
}

// Function to generate the highlighted HTML
function generateHighlightedText(text, keywords, omittedWords) {
    let words = text.split(/\s+/);
    let lowerKeywords = keywords.map(k => k.toLowerCase());
    let lowerOmittedWords = omittedWords.map(ow => ow.toLowerCase());

    let result = words.map(word => {
        let cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
        if (lowerKeywords.includes(cleanWord)) {
            // Highlight keyword
            return `<span style="background-color: yellow;">${word}</span>`;
        } else if (lowerOmittedWords.includes(cleanWord)) {
            // Dim omitted word
            return `<span style="opacity: 0.5;">${word}</span>`;
        } else {
            return word;
        }
    });
    return result.join(' ');
}

// Main execution
let textNodes = getTextNodes();
processTextNodes(textNodes);