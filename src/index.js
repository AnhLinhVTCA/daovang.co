import "./index.css";
import {
  createGameLoop,
  resizeCanvas,
  createBatch,
  createOrthoCamera,
  drawLine,
  Vector2,
  InputHandler
} from "gdxjs/lib";
import createWhiteTexture from "gl-white-texture";

const info = document.getElementById("info");
const canvas = document.getElementById("main");

const [width, height] = resizeCanvas(canvas);
const gl = canvas.getContext("webgl");
const batch = createBatch(gl);
const whiteText = createWhiteTexture(gl);
const cam = createOrthoCamera(width, height, width, height);

let Shotting = false;
let LENGTH = 100;
let Angle = Math.PI / 2;
let currentAngle = Math.PI / 10;
const tmp = new Vector2(LENGTH, 0);
const tmp2 = new Vector2(0, 0);
const tmp3 = new Vector2(0, 0);
const line = new Vector2(width / 2, height / 11);

const inputHandler = new InputHandler(canvas);
let moveLeft = false;
let moveRight = false;

document.addEventListener("keydown", e => {
  if (!Shotting && e.which === 37) {
    moveLeft = true;
  }
  if (!Shotting && e.which === 39) {
    moveRight = true;
  }
  if (e.which === 32) {
    Shotting = true;
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
  Shotting = true;
});

const processMove = () => {
  if (moveLeft && line.x > 25) {
    line.x -= 10;
  } else if (moveRight && line.x < width - 25) {
    line.x += 10;
  }
};

const Speed = 5;
const SpeedBack = 3;
let currentLength = 0;
let status = true;
const processState = delta => {
  if (Shotting) {
    if (status) {
      tmp.set((LENGTH += Speed), 0);
      tmp.rotateRad(currentAngle);
      tmp2.setVector(line).addVector(tmp);
    }
    if (status && tmp2.x > 0 && tmp2.x < width && tmp2.y < height) {
      currentLength = LENGTH;
    } else {
      if (currentLength > 100) {
        tmp.set((currentLength -= SpeedBack), 0);
        tmp.rotateRad(currentAngle);
        tmp2.setVector(line).addVector(tmp);
        status = false;
      } else {
        Shotting = false;
        status = true;
        LENGTH = 100;
      }
    }
  } else {
    currentAngle += delta * Angle;
    if (currentAngle < Math.PI / 10 || currentAngle > (Math.PI * 9) / 10) {
      Angle *= -1;
    }
    tmp.set(LENGTH, 0);
    // tmp.rotateRad(currentAngle);
    tmp.rotateRad(Math.PI / 2);
    tmp2.setVector(line).addVector(tmp);
  }

  batch.begin();
  drawLine(batch, whiteText, line.x, line.y, tmp2.x, tmp2.y, 10);
  batch.end();
};

const draw = () => {
  batch.setProjection(cam.combined);
  batch.begin();
  batch.draw(whiteText, 0, height / 11, width, 10);
  batch.draw(whiteText, line.x - 25, line.y - 40, 50, 50);
  batch.end();
};

gl.clearColor(0, 0, 0, 1);

const update = delta => {
  gl.clear(gl.COLOR_BUFFER_BIT);
  processMove();
  processState(delta);
  draw();
};

const game = createGameLoop(update);

setInterval(() => {
  info.innerHTML = `FPS : ${Math.floor(game.getFps())}`;
}, 1000);
