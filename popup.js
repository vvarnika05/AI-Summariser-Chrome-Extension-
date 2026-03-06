document.getElementById("summarize").addEventListener("click", () => {
    //console.log("Button clicked");
    const result = document.getElementById("result");
    const summaryType = document.getElementById("summary-type").value;


    result.innerHTML = '<div class="loader"></div>';


    //get user's api key
    chrome.storage.sync.get(['geminiApiKey'], ({ geminiApiKey }) => {
        if (!geminiApiKey) {
            result.textContent = "Please set your Gemini API key in the options page.";
            return;
        }
        //ask content.js for the page text
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            chrome.tabs.sendMessage(tab.id, { type: "GET_ARTICLE_TEXT" }, async (response) => {
                if (chrome.runtime.lastError) {
                    result.textContent = `Could not read article text: ${chrome.runtime.lastError.message}`;
                    return;
                }
                if (!response || !response.text) {
                    result.textContent = "No article text found on this page.";
                    return;
                }
                //send text to gemini
                const { text } = response;
                try {
                    const summary = await getGeminiSummary(text, summaryType, geminiApiKey);
                    result.textContent = summary;
                } catch (err) {
                    result.textContent = `Error generating summary: ${err.message || err}`;
                }
                // result.textContent = text.slice(0, 300) + "...";
            });
        });//helps us find the active tabs so we know which page to talk to
    });
    // chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    //     chrome.tabs.sendMessage(tab.id, { type: "GET_ARTICLE_TEXT" }, (response) => {
    //         if (!response || !response.text) {
    //             result.textContent = "No article text found on this page.";
    //             return;
    //         }

    //         const { text } = response;
    //         result.textContent = text.slice(0, 300) + "...";
    //     });
    // });//helps us find the active tabs so we know which page to talk to
})




async function getGeminiSummary(rawText, type, apiKey) {
    const max = 20000;
    const text = rawText.length > max ? rawText.slice(0, max) : rawText;

    const promptMap = {
        brief: `Summarize in 2-3 sentences:\n\n${text}`,
        detailed: `Give a detailed summary:\n\n${text}`,
        bullet: `Summarize in 5-7 bullet points(start each line with "-" ):\n\n${text}`,
    };

    const prompt = promptMap[type] || promptMap.brief;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.2,
                }
            })
        }
    );

    if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error.message || "Failed to fetch summary from Gemini API");
    }


    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Summary not available.";
}


document.getElementById("copy-btn").addEventListener("click", () => {
    const txt = document.getElementById("result").textContent;
    if (!txt) return;
    navigator.clipboard.writeText(txt).then(() => {
        const btn = document.getElementById("copy-btn");
        const old = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => btn.textContent = old, 2000);
    })
})