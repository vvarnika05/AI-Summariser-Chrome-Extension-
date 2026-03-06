chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(["geminiApiKey"], (result) => {
        if (!result.geminiApiKey) {
            chrome.tabs.create({ url: "options.html" });
        }
    }) //will synchronise all of your accounts with this storage
})

