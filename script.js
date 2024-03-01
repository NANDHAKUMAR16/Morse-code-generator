var morseCode = {
  A: ".-",
  B: "-...",
  C: ".. .",
  D: "-..",
  E: ".",
  F: ".-.",
  G: "--.",
  H: "....",
  I: "..",
  J: "-.-.",
  K: "-.-",
  L: "⸺",
  M: "--",
  N: "-.",
  O: ". .",
  P: ".....",
  Q: "..-.",
  R: ". ..",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: ".-..",
  Y: ".. ..",
  Z: "... .",
  1: ".--.",
  2: "..-..",
  3: "...-.",
  4: "....-",
  5: "---",
  6: "......",
  7: "--..",
  8: "-....",
  9: "-..-",
  0: "⸻",
  " ": "__",
  ".": "..--..",
  ",": ".-.-",
  ":": "-.- . .",
  "?": "-..-.",
  "'": "..-. .-..",
  "-": "... .-..",
  "/": "..- -",
  "(": "..... -.",
  ")": "..... .. ..",
  "&": ". ...",
  "!": "---.",
  ";": "... ..",
  "@": "</>",
  "=": ".__.",
  "~": "_",
  _: ".._-",
};
var ans = "";
document.querySelector("#fileInput").style.display = "none";
var temp;
const convertToMorse = (str) => {
  document.querySelector("textarea").innerText = "";
  for (let i = 0; i < str.length; i++) {
    ans += morseCode[str[i]];
    ans += "  ";
  }
  document.querySelector("textarea").value = ans.split();
  ans = "";
};

function check() {
  var fileInput = document.getElementById("fileInput");
  var file = fileInput.files[0];
  file.name = "";
  if (file) {
    var reader = new FileReader();
    console.log("FileReader Class : " + reader);
    reader.onload = function (event) {
      var img = new Image();
      console.log("Image class : " + img);
      img.onload = function () {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        console.log("ctx : " + ctx);
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var code = jsQR(imageData.data, imageData.width, imageData.height);
        console.log("Code : " + code.data);
        if (code) {
          document.querySelector(".inputField").value = code.data;
          document.getElementById("fileInput").style.visibility = "hidden";
        } else {
          document.querySelector(".inputField").value = "No QR Code found.";
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function encode() {
  convertToMorse(document.querySelector("input").value.toUpperCase());
}
function decode() {
  const values = document.querySelector("input").value.trim().split("  ");
  let ans = "";
  if (values.length > 1) {
    for (let i = 0; i < values.length; i++) {
      for ([key, value] of Object.entries(morseCode)) {
        if (value === values[i] && values[i] != "undefined") ans += String(key);
      }
    }
    document.querySelector("textarea").value = ans;
  }
}
function cleartext() {
  document.querySelector("textarea").value = "";
  document.querySelector("input").value = "";
  setTimeout(() => {
    document.querySelector(".clear-pop-up").style.top = "-20%";
    document.querySelector(".clear-pop-up").style.transform = "scale(.1)";
  }, 1200);
}

function copyCode() {
  setTimeout(() => {
    document.querySelector(".pop-up").style.top = "-20%";
    document.querySelector(".pop-up").style.transform = "scale(.1)";
    document.querySelector("input").focus();
    if (document.querySelector("textarea").value.length > 0) {
      document.querySelector("textarea").setSelectionRange(0, 99999);
      navigator.clipboard.writeText(document.querySelector("textarea").value);
      document.querySelector("input").value = "";
    }
  }, 1200);
}
function showPopUp() {
  document.querySelector(".pop-up").style.top = "3%";
  document.querySelector(".pop-up").style.transform = "scale(1)";
}
function clearPopUp() {
  document.querySelector(".clear-pop-up").style.top = "3%";
  document.querySelector(".clear-pop-up").style.transform = "scale(1)";
}

function downloadAudio() {
  const morse = document.querySelector(".morseTextarea").value;
  const soundUrls = morseToAudio(morse);

  const zip = new JSZip();

  soundUrls.forEach((soundUrl, index) => {
    if (soundUrl) {
      fetch(soundUrl)
        .then((response) => response.blob())
        .then((blob) => {
          console.log(blob);
          zip.file(`Morse audio`, blob);
          if (index === soundUrls.length - 1) {
            zip.generateAsync({ type: "blob" }).then((content) => {
              const url = window.URL.createObjectURL(content);
              const a = document.createElement("a");
              a.href = url;
              a.download = "morse_code_audio.zip";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            });
          }
        });
    }
  });
}
var stopAudio; // Declare a variable to hold the reference to the currently playing audio

function playAudio(checkNum) {
  var morse = document.querySelector(".morseTextarea").value;
  const soundUrls = morseToAudio(morse);

  soundUrls.forEach((soundUrl, index) => {
    setTimeout(() => {
      if (soundUrl) {
        var audio = new Audio(soundUrl);
        audio.play();
        stopAudio = audio; // Store the reference to the currently playing audio
      }
    }, index * 800);
  });
}

const stopAudios = () => {
  if (stopAudio) {
    stopAudio.pause();
    stopAudio = null;
  }
};

const morseToAudio = (morse) => {
  const soundUrls = [];
  morse.split("  ").forEach((word) => {
    word.split("").forEach((singleWord) => {
      if (singleWord == ".") soundUrls.push("dot.wav");
      else if (singleWord == "-") soundUrls.push("bell.mp3");
      else if (singleWord == "_") soundUrls.push("fireworks-1.mp3");
      else soundUrls.push(null);
    });
  });
  return soundUrls;
};

var downloadImg;
const getQR = () => {
  const value = document.querySelector("textarea").value;
  const encodedValue = encodeURIComponent(value);
  const api = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedValue}`;
  downloadImg = api;
  if (value.length > 0) {
    document.querySelector(".showQR").style.visibility = "visible";
    document.querySelector(".showQR img").setAttribute("src", api);
  }
};

const downloadQRImg = () => {
  fetch(downloadImg)
    .then((res) => res.blob())
    .then((blob) => {
      console.log(blob);
      const a = document.createElement("a");
      console.log(a);
      a.href = URL.createObjectURL(blob);
      a.download = "MorseCodeQR.jpg";
      console.log(a);
      a.click();
    });
};
