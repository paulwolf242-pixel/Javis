const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const micButton = document.getElementById("micButton");
const messages = document.getElementById("messages");
const assistantStatus = document.getElementById("assistantStatus");

function updateClock() {
    document.getElementById("clock").textContent =
        new Date().toLocaleTimeString("de-DE");
}

updateClock();
setInterval(updateClock, 1000);

function addMessage(text, sender) {
    const message = document.createElement("div");
    message.classList.add("message",
        sender === "user" ? "user-message" : "jarvis-message");

    const label = document.createElement("span");
    label.className = "sender";
    label.textContent = sender === "user" ? "DU" : "J.A.R.V.I.S.";

    const content = document.createElement("div");
    content.textContent = text;

    message.append(label, content);
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

function speak(text) {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "de-DE";
    speech.rate = 0.95;
    speech.pitch = 0.85;

    speech.onstart = () => {
        assistantStatus.textContent = "JARVIS SPRICHT";
    };

    speech.onend = () => {
        assistantStatus.textContent = "JARVIS IST BEREIT";
    };

    window.speechSynthesis.speak(speech);
}

function getResponse(question) {
    const text = question.toLowerCase();

    if (text.includes("hallo") || text.includes("hi jarvis")) {
        return "Guten Tag. Mein System ist bereit.";
    }

    if (text.includes("wie spät") || text.includes("uhrzeit")) {
        return "Es ist " + new Date().toLocaleTimeString("de-DE") + " Uhr.";
    }

    if (text.includes("datum")) {
        return "Heute ist der " + new Date().toLocaleDateString("de-DE") + ".";
    }

    if (text.includes("wer bist du") || text.includes("dein name")) {
        return "Mein Name ist JARVIS. Ich bin Ihr persönlicher digitaler Assistent.";
    }

    if (text.includes("wie geht es dir") || text.includes("alles klar")) {
        return "Alle lokalen Systeme funktionieren.";
    }

    if (text.includes("hilfe") || text.includes("was kannst du")) {
        return "Ich kann einfache Nachrichten beantworten, die Uhrzeit anzeigen und mit Ihnen sprechen. Meine KI-Funktionen werden später erweitert.";
    }

    if (text.includes("danke")) {
        return "Sehr gerne. Ich stehe Ihnen zur Verfügung.";
    }

    return "Ich habe Ihre Nachricht erhalten. Meine Verbindung zur Claude-KI ist noch nicht eingerichtet.";
}

function sendMessage() {
    const question = userInput.value.trim();
    if (!question) return;

    addMessage(question, "user");
    userInput.value = "";

    assistantStatus.textContent = "JARVIS DENKT";

    setTimeout(() => {
        const answer = getResponse(question);
        addMessage(answer, "jarvis");
        assistantStatus.textContent = "JARVIS IST BEREIT";
        speak(answer);
    }, 600);
}

sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", event => {
    if (event.key === "Enter") sendMessage();
});

// Sprachsteuerung
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

    recognition.onstart = () => {
        isListening = true;
        micButton.classList.add("listening");
        assistantStatus.textContent = "ICH HÖRE ZU";
    };

    recognition.onresult = event => {
        userInput.value = event.results[0][0].transcript;
        sendMessage();
    };

    recognition.onend = () => {
        isListening = false;
        micButton.classList.remove("listening");
        assistantStatus.textContent = "JARVIS IST BEREIT";
    };

    recognition.onerror = event => {
        isListening = false;
        micButton.classList.remove("listening");
        assistantStatus.textContent = "MIKROFON: " + event.error;
    };
} else {
    micButton.title = "Spracherkennung nicht unterstützt";
}

micButton.addEventListener("click", () => {
    if (!recognition) {
        addMessage("Die Spracherkennung wird in diesem Browser nicht unterstützt.", "jarvis");
        return;
    }

    if (isListening) {
        recognition.stop();
    } else {
        window.speechSynthesis.cancel();

        try {
            recognition.start();
        } catch (error) {
            assistantStatus.textContent = "MIKROFON IST BESCHÄFTIGT";
        }
    }
});

console.log("J.A.R.V.I.S. Version 1.0 gestartet.");
