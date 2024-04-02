window.addEventListener('DOMContentLoaded', () => {
    const speechRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    const flames = document.querySelectorAll('.mo-fire'),
          body = document.body,
          firework = document.querySelector('.pyro'),
          h1 = document.querySelector('h1');
    let count = 0;

    speechRecognition.onsoundstart = async function() {
        for (const flame of flames) {
            flame.classList.add('blow');
            await new Promise((res) => setTimeout(res, 50));
        }

        count++;
    };

    speechRecognition.onsoundend = async function() {
        if (count > 2) {
            flames.forEach(item => item.style.visibility = 'hidden');
            body.style.backgroundColor = "black";
            firework.style.visibility = "visible";
            h1.style.color = "white";
            speechRecognition.onend = null;
            speechRecognition.stop();
        }

        for (const flame of flames) {
            flame.classList.replace('blow', 'return');
            setTimeout(() => flame.classList.remove('return'), 300);
            await new Promise((res) => setTimeout(res, 50));
        }
    };

    speechRecognition.onend = function() {
        speechRecognition.start();
    };

    speechRecognition.start();
});