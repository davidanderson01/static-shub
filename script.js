const rotatingWord = document.querySelector(".rotating-word");

const rotatingWords = [
  "Craft",
  "Better",
  "Design",
  "Life",
  "Intention",
  "Knowledge",
  "Skill",
  "CraftX",
  "Nexus Institute",
  "Sheet Metal Guru",
  "MaskOff",
  "Intelligence",
  "Our Next Generation",
  "We, Us, Ours",
  "The Wave",
  "Love",
  "The Future",
  "The Next Generation",
  "The Next Wave",
  "Awareness",
  "Moments"
];
const identityWords = ["You", "Us", "We", "I", "Ours"];
const rotationInterval = 2000;
let rotationCount = 4;

if (rotatingWord && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.setInterval(() => {
    rotationCount += 1;
    const choices = rotationCount % 4 === 1 ? identityWords : rotatingWords;
    const currentWord = rotatingWord.textContent;
    const availableWords = choices.filter((word) => word !== currentWord);
    rotatingWord.textContent = availableWords[Math.floor(Math.random() * availableWords.length)];
  }, rotationInterval);
}