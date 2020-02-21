import { Vector2, InputHandler } from "gdxjs/lib";
const notif = document.getElementById("notif");
const time = document.getElementById("time");
const restart = document.getElementById("restart");
let moveLeft = false;
let moveRight = false;
let countDown = 30;

export default (rope, golds, width, height, canvas, setScore) => {
  const inputHandler = new InputHandler(canvas);

  restart.addEventListener("click", () => {
    canvas.style.opacity = 1;
    notif.style.display = "none";
    restart.style.display = "none";
    rope.LENGTH = 100;
    rope.tmp.set(rope.LENGTH, 0);
    rope.Shotting = false;
    rope.hit = false;
    setScore(0);
    countDown = 30;
    golds.length = 0;
    for (let i = 0; i < 3; i++) {
      golds.push({
        pos: new Vector2(
          Math.random() * (width - width / 7) + width / 7,
          Math.random() * (height - 100 - height / 3) + height / 3
        ),
        goldWidth: width / 7,
        goldHeight: height / 14,
        speed: 5,
        score: Math.round(Math.random() * 4 + 1)
      });
    }
  });

  document.addEventListener("keydown", e => {
    if (!rope.Shotting && e.which === 37) {
      moveLeft = true;
    }
    if (!rope.Shotting && e.which === 39) {
      moveRight = true;
    }
    if (e.which === 32) {
      rope.Shotting = true;
    }
  });

  document.addEventListener("keyup", e => {
    if (e.which === 37) {
      moveLeft = false;
    } else if (e.which === 39) {
      moveRight = false;
    }
  });

  inputHandler.addEventListener("touchStart", () => {
    rope.Shotting = true;
  });
  setInterval(() => {
    time.innerHTML = `Time : ${
      golds.length > 0 && countDown > 0
        ? (countDown -= 1)
        : golds.length === 0 && countDown > 0
        ? countDown
        : 0
    }`;
  }, 1000);

  return {
    getMoveLeft: () => moveLeft,
    getMoveRight: () => moveRight,
    getCountDown: () => countDown
  };
};
