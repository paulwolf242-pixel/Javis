// =====================================
// J.A.R.V.I.S. – JavaScript
// =====================================

const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const micButton = document.getElementById("micButton");
const messages = document.getElementById("messages");
const clock = document.getElementById("clock");
const assistantStatus = document.getElementById("assistantStatus");

// =====================================
// UHR UND DATUM
// =====================================

function updateClock() {
    if (!clock) return;

    const now = new Date();

    clock.textContent = now.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

updateClock();
setInterval(updateClock, 1000);

// =====================================
// NACHRICHTEN ANZEIGEN
// =====================================

function addMessage(text, sender) {
    const message = document.createElement("div");

    message.className = sender === "user"
        ? "user-message"
        : "assistant-message";

    message.textContent = text;

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

// =====================================
// SPRACHAUSGABE
// =====================================

function speak(text) {
    if (!("speechSynthesis" in window)) {
        return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE";
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
}

// =====================================
// JARVIS ANTWORTEN
// =====================================

function getResponse(input) {
    const command = input.toLowerCase().trim();

    if (
        command.includes("hallo") ||
        command.includes("hey jarvis")
    ) {
        return "Guten Tag. J.A.R.V.I.S. ist einsatzbereit.";
    }

    if (
        command.includes("uhrzeit") ||
        command.includes("wie spät")
    ) {
        return "Es ist " + new Date().toLocaleTimeString("de-DE") + " Uhr.";
    }

    if (command.includes("datum") || command.includes("welcher tag")) {
        return "Heute ist " + new Date().toLocaleDateString("de-DE", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }

    if (command.includes("hilfe")) {
        return "Du kannst mich nach der Uhrzeit und dem Datum fragen oder Hallo sagen. Weitere Funktionen können wir später hinzufügen.";
    }

    if (command.includes("wer bist du")) {
        return "Ich bin J.A.R.V.I.S., dein persönlicher digitaler Assistent.";
    }

    if (command.includes("stopp") || command.includes("stop")) {
        window.speechSynthesis.cancel();
        return "Sprachausgabe gestoppt.";
    }

    return "Ich habe deinen Befehl erhalten: " + input +
        ". Für eine intelligente Antwort muss ich noch mit einer KI verbunden werden.";
}

// =====================================
// NACHRICHT SENDEN
// =====================================

function sendMessage() {
    if (!userInput || !messages) return;

    const text = userInput.value.trim();

    if (text === "") return;

    addMessage(text, "user");

    userInput.value = "";

    const answer = getResponse(text);

    setTimeout(() => {
        addMessage(answer, "assistant");
        speak(answer);
    }, 400);
}

// =====================================
// ABSENDEN-BUTTON
// =====================================

if (sendButton) {
    sendButton.addEventListener("click", sendMessage);
}

// =====================================
// ENTER-TASTE
// =====================================

if (userInput) {
    userInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });
}

// =====================================
// SPRACHEINGABE
// =====================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let recognition = null;
let isListening = false;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();

    recognition.lang = "de-DE";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function() {
        isListening = true;

        if (assistantStatus) {
            assistantStatus.textContent = "ICH HÖRE ZU ...";
        }
    };

    recognition.onresult = function(event) {
        const spokenText = event.results[0][0].transcript;

        userInput.value = spokenText;

        sendMessage();
    };

    recognition.onerror = function() {
        if (assistantStatus) {
            assistantStatus.textContent = "SPRACHEINGABE FEHLGESCHLAGEN";
        }
    };

    recognition.onend = function() {
        isListening = false;

        if (assistantStatus) {
            assistantStatus.textContent = "J.A.R.V.I.S. BEREIT";
        }
    };
}

// =====================================
// MIKROFON-BUTTON
// =====================================

if (micButton) {
    micButton.addEventListener("click", function() {
        if (!recognition) {
            if (assistantStatus) {
                assistantStatus.textContent =
                    "SPRACHEINGABE WIRD NICHT UNTERSTÜTZT";
            }

            return;
        }

        if (isListening) {
            recognition.stop();
        } else {
            window.speechSynthesis.cancel();

            try {
                recognition.start();
            } catch (error) {
                if (assistantStatus) {
                    assistantStatus.textContent =
                        "MIKROFON IST BESCHÄFTIGT";
                }
            }
        }
    });
}

// =====================================
// STARTMELDUNG
// =====================================

if (assistantStatus) {
    assistantStatus.textContent = "J.A.R.V.I.S. BEREIT";
}

console.log("J.A.R.V.I.S. Version 2.0 gestartet.");
