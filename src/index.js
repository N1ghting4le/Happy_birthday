import "./styles/style.css";
import "./styles/fireworks.css";

window.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const flames = document.querySelectorAll(".mo-fire");
  const firework = document.querySelector(".pyro");
  const h1 = document.querySelector("h1");

  let count = 0;
  let isFinalState = false;
  let isBlowing = false;
  let isTransitioning = false;

  const SENSITIVITY_THRESHOLD = 45;

  async function initAudio() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 256;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      async function blowFlames() {
        for (const flame of flames) {
          flame.classList.remove("return");
          flame.classList.add("blow");
          await new Promise((res) => setTimeout(res, 30));
        }
      }

      async function returnFlames() {
        for (const flame of flames) {
          flame.classList.replace("blow", "return");
          setTimeout(() => flame.classList.remove("return"), 300);
          await new Promise((res) => setTimeout(res, 30));
        }
      }

      function checkVolume() {
        if (isFinalState) return;

        analyser.getByteFrequencyData(dataArray);

        let total = 0;
        for (let i = 0; i < bufferLength; i++) {
          total += dataArray[i];
        }
        const averageVolume = total / bufferLength;

        if (averageVolume > SENSITIVITY_THRESHOLD) {
          if (!isBlowing && !isTransitioning) {
            isBlowing = true;
            isTransitioning = true;

            blowFlames().then(() => {
              isTransitioning = false;
            });
          }
        }

        if (averageVolume < SENSITIVITY_THRESHOLD - 10) {
          if (isBlowing && !isTransitioning) {
            isBlowing = false;
            isTransitioning = true;

            count++;

            if (count >= 3) {
              isFinalState = true;
              flames.forEach((item) => (item.style.visibility = "hidden"));
              body.style.backgroundColor = "black";
              firework.style.visibility = "visible";
              h1.style.color = "white";

              stream.getTracks().forEach((track) => track.stop());
              audioContext.close();
            } else {
              returnFlames().then(() => {
                isTransitioning = false;
              });
            }
          }
        }

        requestAnimationFrame(checkVolume);
      }

      checkVolume();
    } catch (err) {
      console.error("Доступ к микрофону отклонен или не поддерживается:", err);
      alert("Для работы эффекта нужен доступ к микрофону!");
    }
  }
  initAudio();

  const startActivation = () => {
    initAudio();
    body.removeEventListener("click", startActivation);
    body.removeEventListener("touchstart", startActivation);
  };

  body.addEventListener("click", startActivation);
  body.addEventListener("touchstart", startActivation);
});
