var aiModels = [
    "gpt-4o-mini",
    "gpt-4o",
    "o1",
    "o1-mini",
    "o1-pro",
    "o3",
    "o3-mini",
    "o4-mini",
    "gpt-4.1",
    "gpt-4.1-mini",
    "gpt-4.1-nano",
    "gpt-4.5-preview",
    "claude-sonnet-4",
    "claude-opus-4",
    "claude-3-7-sonnet",
    "claude-3-5-sonnet",
    "deepseek-chat",
    "deepseek-reasoner",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "mistral-large-latest",
    "codestral-latest",
    "google/gemma-2-27b-it",
    "grok-beta"
]
var aiModelsName = {
    "gpt-4o-mini": "GPT4o-Mini",
    "gpt-4o": "GPT4o",
    "o1": "GPTo1",
    "o1-mini": "GPTo1-Mini",
    "o1-pro": "GPTo1-Pro",
    "o3": "GPTo3",
    "o3-mini": "GPTo3-Mini",
    "o4-mini": "GPTo4-Mini",
    "gpt-4.1": "GPT4.1",
    "gpt-4.1-mini": "GPT4.1-Mini",
    "gpt-4.1-nano": "GPT4.1-Nano",
    "gpt-4.5-preview": "GPT4.5-Preview",
    "claude-sonnet-4": "Claude-Sonnet-4",  
    "claude-opus-4": "Claude-Opus-4",
    "claude-3-7-sonnet": "Claude-Sonnet-3.7",
    "claude-3-5-sonnet": "Claude-Sonnet-3.5",
    "deepseek-chat": "Deepseek-Chatter",
    "deepseek-reasoner": "Deepseek-Reasoner",
    "gemini-2.0-flash": "Gemini-2.0-Flash",
    "gemini-1.5-flash": "Gemini-1.5-Flash",
    "mistral-large-latest": "Mistral-Large",
    "codestral-latest": "Codestral",
    "google/gemma-2-27b-it": "Google-Gemma",
    "grok-beta": "Grok-Beta"
}
var selectedModel = aiModels[0];
var conversationHistory = [
    {role: "system", content: `You are ${aiModelsName[selectedModel]}, an AI assistant with the capability to perform live web searches or access real-time data.`},
    {role: "system", content: `Today is ${Date()}`},
];
var imagesURLHistory = [];
var fileInput = "";

function reloadPuter(query, imageURL, userTimeElem) {
    var existingPuterScript = document.querySelector('script[src="https://js.puter.com/v2/"]');
    if (existingPuterScript) {
        existingPuterScript.parentNode.removeChild(existingPuterScript);
    }
    var newPuterScript = document.createElement('script');
    newPuterScript.src = "https://js.puter.com/v2/";
    document.head.appendChild(newPuterScript);
    setTimeout(() => {
        needWebSearch(query, imageURL, userTimeElem);
    }, 1000)
}

function modelPopupSwitch() {
    var blurScreen = document.getElementById("blur-screen");
    var aiModelPopup = document.getElementById("ai-model-popup");
    blurScreen.style.display = blurScreen.style.display === "none" ? "block" : "none";
    aiModelPopup.style.display = aiModelPopup.style.display === "none" ? "flex" : "none";
}

function modelSwitch(modelNum) {
    selectedModel = aiModels[modelNum - 1];
    document.getElementById("ai-model").children[1].innerText = aiModelsName[aiModels[modelNum - 1]];
    modelPopupSwitch();
    clearConversation();
}

function popupLoading(statusMessage) {
    killPopupLoading();
    var conversationContainer = document.getElementById("conversation-container");
    var parentDiv = document.createElement("div");
    var childDiv = document.createElement("div");
    var promptStat = document.createElement("h4");
    var firstSpan = document.createElement("span");
    var secondSpan = document.createElement("span");
    var thirdSpan = document.createElement("span");
    if (statusMessage) {
        promptStat.innerText = statusMessage;
        childDiv.appendChild(promptStat);
    }
    childDiv.appendChild(firstSpan);
    childDiv.appendChild(secondSpan);
    childDiv.appendChild(thirdSpan);
    parentDiv.appendChild(childDiv);
    parentDiv.setAttribute("class", "loading-container");
    conversationContainer.appendChild(parentDiv);
    window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
}

function killPopupLoading() {
    var loadingContainer = document.querySelectorAll(".loading-container");
    if (loadingContainer.length > 0) {
        loadingContainer[loadingContainer.length - 1].remove();
    }
}

function clearConversation() {
    conversationHistory = [
        {role: "system", content: `You are ${aiModelsName[selectedModel]}, an AI assistant with the capability to perform live web searches or access real-time data.`},
        {role: "system", content: `Today is ${Date()}`},
    ];
    imagesURLHistory = [];
    document.getElementById("conversation-container").innerHTML = "";
    window.scrollTo({top: 0, behavior: "smooth"});
}

function detectDirection(message) {
    var rtlRegex = /[\u0590-\u05FF\u0600-\u06FF]/;
    if (rtlRegex.test(message)) {
        return "rtl";
    } else {
        return "ltr";
    }
}

function uploadFiles() {
    fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("accept", "image/*");
    fileInput.click();
}

function sendAiMessage(query, imageURL, userTimeElem, isWebSearched=false) {
    var parentDiv = document.createElement("div");
    parentDiv.setAttribute("class", "ai-message-container");
    var childDiv = document.createElement("div");
    var timeElem = document.createElement("time");
    var date = new Date();
    if (date.getHours() < 12) {
        timeElem.innerText = `${date.getHours()}:${date.getMinutes()} AM`;
    } else {
        timeElem.innerText = `${date.getHours()}:${date.getMinutes()} PM`;
    };
    if (isWebSearched === false) {
        timeElem.innerHTML += `<svg width="17.5px" height="17.5px" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" style="margin-left: 2.5px;"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M12 3L13.4302 8.31181C13.6047 8.96 13.692 9.28409 13.8642 9.54905C14.0166 9.78349 14.2165 9.98336 14.451 10.1358C14.7159 10.308 15.04 10.3953 15.6882 10.5698L21 12L15.6882 13.4302C15.04 13.6047 14.7159 13.692 14.451 13.8642C14.2165 14.0166 14.0166 14.2165 13.8642 14.451C13.692 14.7159 13.6047 15.04 13.4302 15.6882L12 21L10.5698 15.6882C10.3953 15.04 10.308 14.7159 10.1358 14.451C9.98336 14.2165 9.78349 14.0166 9.54905 13.8642C9.28409 13.692 8.96 13.6047 8.31181 13.4302L3 12L8.31181 10.5698C8.96 10.3953 9.28409 10.308 9.54905 10.1358C9.78349 9.98336 9.98336 9.78349 10.1358 9.54905C10.308 9.28409 10.3953 8.96 10.5698 8.31181L12 3Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>`;
    } else {
        timeElem.innerHTML += `<svg width="17.5px" height="17.5px" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" style="margin-left: 2.5px;"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M12 3L13.4302 8.31181C13.6047 8.96 13.692 9.28409 13.8642 9.54905C14.0166 9.78349 14.2165 9.98336 14.451 10.1358C14.7159 10.308 15.04 10.3953 15.6882 10.5698L21 12L15.6882 13.4302C15.04 13.6047 14.7159 13.692 14.451 13.8642C14.2165 14.0166 14.0166 14.2165 13.8642 14.451C13.692 14.7159 13.6047 15.04 13.4302 15.6882L12 21L10.5698 15.6882C10.3953 15.04 10.308 14.7159 10.1358 14.451C9.98336 14.2165 9.78349 14.0166 9.54905 13.8642C9.28409 13.692 8.96 13.6047 8.31181 13.4302L3 12L8.31181 10.5698C8.96 10.3953 9.28409 10.308 9.54905 10.1358C9.78349 9.98336 9.98336 9.78349 10.1358 9.54905C10.308 9.28409 10.3953 8.96 10.5698 8.31181L12 3Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>`;
        timeElem.innerHTML += `<svg width="17.5px" height="17.5px" viewBox="1.5 1.5 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.83824 18.4467C10.0103 18.7692 10.1826 19.0598 10.3473 19.3173C8.59745 18.9238 7.07906 17.9187 6.02838 16.5383C6.72181 16.1478 7.60995 15.743 8.67766 15.4468C8.98112 16.637 9.40924 17.6423 9.83824 18.4467ZM11.1618 17.7408C10.7891 17.0421 10.4156 16.1695 10.1465 15.1356C10.7258 15.0496 11.3442 15 12.0001 15C12.6559 15 13.2743 15.0496 13.8535 15.1355C13.5844 16.1695 13.2109 17.0421 12.8382 17.7408C12.5394 18.3011 12.2417 18.7484 12 19.0757C11.7583 18.7484 11.4606 18.3011 11.1618 17.7408ZM9.75 12C9.75 12.5841 9.7893 13.1385 9.8586 13.6619C10.5269 13.5594 11.2414 13.5 12.0001 13.5C12.7587 13.5 13.4732 13.5593 14.1414 13.6619C14.2107 13.1384 14.25 12.5841 14.25 12C14.25 11.4159 14.2107 10.8616 14.1414 10.3381C13.4732 10.4406 12.7587 10.5 12.0001 10.5C11.2414 10.5 10.5269 10.4406 9.8586 10.3381C9.7893 10.8615 9.75 11.4159 9.75 12ZM8.38688 10.0288C8.29977 10.6478 8.25 11.3054 8.25 12C8.25 12.6946 8.29977 13.3522 8.38688 13.9712C7.11338 14.3131 6.05882 14.7952 5.24324 15.2591C4.76698 14.2736 4.5 13.168 4.5 12C4.5 10.832 4.76698 9.72644 5.24323 8.74088C6.05872 9.20472 7.1133 9.68686 8.38688 10.0288ZM10.1465 8.86445C10.7258 8.95042 11.3442 9 12.0001 9C12.6559 9 13.2743 8.95043 13.8535 8.86447C13.5844 7.83055 13.2109 6.95793 12.8382 6.2592C12.5394 5.69894 12.2417 5.25156 12 4.92432C11.7583 5.25156 11.4606 5.69894 11.1618 6.25918C10.7891 6.95791 10.4156 7.83053 10.1465 8.86445ZM15.6131 10.0289C15.7002 10.6479 15.75 11.3055 15.75 12C15.75 12.6946 15.7002 13.3521 15.6131 13.9711C16.8866 14.3131 17.9412 14.7952 18.7568 15.2591C19.233 14.2735 19.5 13.1679 19.5 12C19.5 10.8321 19.233 9.72647 18.7568 8.74093C17.9413 9.20477 16.8867 9.6869 15.6131 10.0289ZM17.9716 7.46178C17.2781 7.85231 16.39 8.25705 15.3224 8.55328C15.0189 7.36304 14.5908 6.35769 14.1618 5.55332C13.9897 5.23077 13.8174 4.94025 13.6527 4.6827C15.4026 5.07623 16.921 6.08136 17.9716 7.46178ZM8.67765 8.55325C7.61001 8.25701 6.7219 7.85227 6.02839 7.46173C7.07906 6.08134 8.59745 5.07623 10.3472 4.6827C10.1826 4.94025 10.0103 5.23076 9.83823 5.5533C9.40924 6.35767 8.98112 7.36301 8.67765 8.55325ZM15.3224 15.4467C15.0189 16.637 14.5908 17.6423 14.1618 18.4467C13.9897 18.7692 13.8174 19.0598 13.6527 19.3173C15.4026 18.9238 16.921 17.9186 17.9717 16.5382C17.2782 16.1477 16.3901 15.743 15.3224 15.4467ZM12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" fill="#ffffff"></path></g></svg>`;
    }
    try {
        conversationHistory.push({role: "user", content: query});
        if (imageURL !== null) {
            popupLoading("Analyzing");
            imagesURLHistory.push(imageURL);
            var messages = query;
        } else {
            popupLoading("Generating");
            var messages = conversationHistory;
        };
        puter.ai.chat(messages, imageURL, options={model: selectedModel}).then(response => {
            popupLoading();
            if (typeof response.message.content[0].text === "undefined") {
                var message = response.message.content;
            } else {
                var message = response.message.content[0].text;
            }
            childDiv.style.direction = detectDirection(message);
            conversationHistory.push({role: "assistant", content: message});
            var words = message.split(" ");
            childDiv.innerText = words[0];
            userTimeElem.children[0].children[2].innerHTML += `<path fill-rule="evenodd" clip-rule="evenodd" d="M20.5175 7.01946C20.8174 7.30513 20.829 7.77986 20.5433 8.07981L11.9716 17.0798C11.8201 17.2389 11.6065 17.3235 11.3872 17.3114C11.1679 17.2993 10.9649 17.1917 10.8318 17.0169L10.4035 16.4544C10.1526 16.1249 10.2163 15.6543 10.5458 15.4034C10.8289 15.1878 11.2161 15.2044 11.4787 15.4223L19.4571 7.04531C19.7428 6.74537 20.2175 6.73379 20.5175 7.01946Z" fill="#ffffff"></path>`;
            parentDiv.appendChild(childDiv);
            document.getElementById("conversation-container").appendChild(parentDiv);
            window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
            killPopupLoading();
            words.forEach((word, index) => {
                if (index !== 0) {
                    setTimeout(() => {
                        childDiv.innerText += (index > 0 ? ' ' : '') + word;
                        window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
                        if (index + 1 === words.length) {
                            childDiv.innerHTML = marked.marked(conversationHistory[conversationHistory.length - 1].content);
                            childDiv.appendChild(timeElem);
                            window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
                        }
                    }, index * 75)
                }
            });
        }).catch(error => {
            conversationHistory.pop();
            sendAiMessage(query, imageURL, userTimeElem);
        });
    } catch (error) {
        conversationHistory.pop();
        reloadPuter(query, imageURL, userTimeElem);
    }
}

function sendUserMessage() {
    var parentDiv = document.createElement("div");
    parentDiv.setAttribute("class", "user-message-container");
    var childDiv = document.createElement("div");
    var img = document.createElement("img");
    if (typeof fileInput === 'object') {
        var file = fileInput.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                img.src = e.target.result;
                img.style.display = 'block';
            }
            reader.readAsDataURL(file);
            fileInput = "";
        }
    };
    var p = document.createElement("p");
    var timeElem = document.createElement("time");
    var date = new Date();
    if (date.getHours() < 12) {
        timeElem.innerText = `${date.getHours()}:${date.getMinutes()} AM`;
    } else {
        timeElem.innerText = `${date.getHours()}:${date.getMinutes()} PM`;
    };
    timeElem.innerHTML += `<svg width="17.5px" height="17.5px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 2.5px;"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.4933 6.93502C15.8053 7.20743 15.8374 7.68122 15.565 7.99325L7.70786 16.9933C7.56543 17.1564 7.35943 17.25 7.14287 17.25C6.9263 17.25 6.72031 17.1564 6.57788 16.9933L3.43502 13.3933C3.16261 13.0812 3.19473 12.6074 3.50677 12.335C3.8188 12.0626 4.29259 12.0947 4.565 12.4068L7.14287 15.3596L14.435 7.00677C14.7074 6.69473 15.1812 6.66261 15.4933 6.93502Z" fill="#ffffff"></path></g></svg>`;
    var message = document.getElementById("user-control-container").children[1].value;
    document.getElementById("user-control-container").children[1].value = ""
    if (message.trim().length !== 0) {
        childDiv.style.direction = detectDirection(message);
        p.innerText = message;
        childDiv.appendChild(img);
        childDiv.appendChild(p);
        childDiv.appendChild(timeElem);
        parentDiv.appendChild(childDiv);
        document.getElementById("conversation-container").appendChild(parentDiv);
        popupLoading();
        if (file) {
            setTimeout(() => {
                window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
                var loadImageInterval = setInterval(function() {
                    if (img.src.startsWith("data:image")) {
                        needWebSearch(message, img.src, timeElem);
                        clearInterval(loadImageInterval);
                    }
                }, 250)
            }, 250)
        } else {
            window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
            needWebSearch(message, null, timeElem);
        }
    }
}

function needWebSearch(query, imageURL, timeElem) {
    try {
        var confidenceMessage = [{role: 'system', content: `Just Give A Number Between 0 To 1! Whats your confidence rate in answering this in the real-time (If you need searching then give below 0.7): "${query}"`}];
        puter.ai.chat(confidenceMessage).then(response => {
            try {
                if (parseFloat(response.message.content) <= 0.7) {
                    if (imageURL === null) {
                        popupLoading("Searching");
                        var temp = conversationHistory.concat();
                        temp.push({role: "system", content: `Just Give A Sentence That I Should Search For According To: ${query}\nNote: Don't Say Any Thing Else!`});
                        puter.ai.chat(temp).then(response => {
                            query = response.message.content;
                            webSearch(query, imageURL, timeElem);
                        })
                    } else {
                        sendAiMessage(query, imageURL, timeElem);
                    }
                } else {
                    sendAiMessage(query, imageURL, timeElem);
                }
            } catch {
                sendAiMessage(query, imageURL, timeElem);
            }
        }).catch(error => {
            needWebSearch(query, imageURL, timeElem);
        });
    } catch (error) {
        reloadPuter(query, imageURL, timeElem);
    }
}

function webSearch(query, imageURL, timeElem) {
    fetch('https://api.langsearch.com/v1/web-search', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer sk-fc06a4a532b84bb5b223494122efcdcc',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            freshness: "noLimit",
            summary: true,
            count: 10
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(response => {
        var role = 'system';
        var content = JSON.stringify(response.data.webPages.value);
        conversationHistory.push({
            role: role,
            content: content
        });
        sendAiMessage(query, imageURL, timeElem, true);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}