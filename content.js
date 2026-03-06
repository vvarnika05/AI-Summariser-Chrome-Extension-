//it runs inside the webpage dom. it helps to query the element like if you wanna extract some text out of a webpage

function getArticleText() {
    const article = document.querySelector("article");
    if (article) {
        return article.innerText;
    }
    const paragraphs = Array.from(document.querySelectorAll("p")); //we take all the paragraphs and convert it into an array
    if (paragraphs.length > 0)
        return paragraphs.map(p => p.innerText).join("\n"); //we take the inner text of each paragraph and join them with a new line
    return document.body ? document.body.innerText : "";
}

//it runs when it listens for some commands from popup.js
chrome.runtime.onMessage.addListener((req, _sender, sendResponse) => {
    if (req.type == 'GET_ARTICLE_TEXT') {
        const text = getArticleText();
        sendResponse({ text })
    }
})