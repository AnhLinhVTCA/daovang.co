import "./index.css";
import {
  createGameLoop,
  resizeCanvas,
  createBatch,
  createOrthoCamera
} from "gdxjs/lib";
import createWhiteTexture from "gl-white-texture";
import {
  image,
  createRope,
  createGolds,
  processState,
  processMove,
  drawEnviroment,
  drawGold,
  eventHandler
} from "./components";

const init = async () => {
  const canvas = document.getElementById("main");
  const notif = document.getElementById("notif");
  const restart = document.getElementById("restart");
  const [width, height] = resizeCanvas(canvas);
  const gl = canvas.getContext("webgl");
  const batch = createBatch(gl);
  const whiteText = createWhiteTexture(gl);
  const cam = createOrthoCamera(width, height, width, height);
  const img = await image(gl, width, height);
  const rope = createRope(width, height);
  const golds = createGolds(width, height);
  let score = 0;
  const event = eventHandler(rope, golds, width, height, canvas, score);
  gl.clearColor(0, 0, 0, 1);
  const update = delta => {
    if (event.getCountDown() > 0 && golds.length > 0) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      processMove(
        event.getMoveLeft(),
        rope,
        event.getMoveRight(),
        width,
        delta
      );
      processState(
        delta,
        batch,
        whiteText,
        rope,
        golds,
        width,
        height,
        img,
        score
      );
      drawEnviroment(batch, whiteText, cam, rope, width, height);
      for (const gold of golds) {
        drawGold(batch, whiteText, cam, gold);
      }
    } else if (event.getCountDown() > 0 && golds.length === 0) {
      canvas.style.opacity = 0.3;
      notif.innerHTML = `You Win`;
      notif.style.left = "4em";
      notif.style.display = "block";
      restart.style.display = "block";
    } else {
      canvas.style.opacity = 0.3;
      notif.innerHTML = `Game Over`;
      notif.style.left = "3.2em";
      notif.style.display = "block";
      restart.style.display = "block";
    }
  };

  createGameLoop(update);
};

init();
