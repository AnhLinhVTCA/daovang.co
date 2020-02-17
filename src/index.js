import "./index.css";
import {
  createGameLoop,
  resizeCanvas,
  createBatch,
  createOrthoCamera,
  drawLine,
  Vector2,
  InputHandler,
  loadTexture
} from "gdxjs/lib";
import createWhiteTexture from "gl-white-texture";

const init = async () => {
  const info = document.getElementById("info");
  const canvas = document.getElementById("main");

  const [width, height] = resizeCanvas(canvas);
  const gl = canvas.getContext("webgl");
  const batch = createBatch(gl);
  const whiteText = createWhiteTexture(gl);
  const cam = createOrthoCamera(width, height, width, height);
  const texture = await loadTexture(
    gl,
    "./—Pngtree—anchor tattoo pattern_5062747.png"
  );

  const rope = {
    Shotting: false,
    LENGTH: 100,
    Angle: Math.PI / 2,
    currentAngle: Math.PI / 10,
    line: new Vector2(width / 2, height / 11),
    tmp: new Vector2(100, 0),
    tmp2: new Vector2(0, 0),
    Speed: 5,
    SpeedBack: 3,
    currentLength: 0,
    status: true
  };

  const inputHandler = new InputHandler(canvas);
  let moveLeft = false;
  let moveRight = false;
  const gold = [
    {
      pos: new Vector2(
        Math.random() * (width - 50) + 50,
        Math.random() * (height - 100 - height / 3) + height / 3
      ),
      speed: 1,
      hit: false
    },
    {
      pos: new Vector2(
        Math.random() * (width - 50) + 50,
        Math.random() * (height - 100 - height / 3) + height / 3
      ),
      speed: 2,
      hit: false
    }
  ];
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

  const processMove = () => {
    if (moveLeft && rope.line.x > 25) {
      rope.line.x -= 10;
    } else if (moveRight && rope.line.x < width - 25) {
      rope.line.x += 10;
    }
  };

  const processState = delta => {
    if (rope.Shotting) {
      if (rope.status) {
        rope.tmp.set((rope.LENGTH += rope.Speed), 0);
        rope.tmp.rotateRad(rope.currentAngle);
        rope.tmp2.setVector(rope.line).addVector(rope.tmp);
      }
      for (let i = 0; i < gold.length; i++) {
        const Gold = gold[i];
        if (
          !Gold.hit &&
          Math.floor(
            Math.sqrt(
              (rope.tmp2.x - Gold.pos.x) * (rope.tmp2.x - Gold.pos.x) +
                (rope.tmp2.y - Gold.pos.y) * (rope.tmp2.y - Gold.pos.y)
            )
          ) <= 75
        ) {
          rope.status = false;
          Gold.hit = true;
          rope.currentLength = rope.LENGTH;
          break;
        }
      }

      if (
        rope.status &&
        rope.tmp2.x > -50 &&
        rope.tmp2.x < width + 50 &&
        rope.tmp2.y < height + 50
      ) {
        rope.currentLength = rope.LENGTH;
      } else {
        if (rope.currentLength > 100) {
          for (let i = 0; i < gold.length; i++) {
            const Gold = gold[i];
            if (Gold.hit) {
              rope.tmp.set((rope.currentLength -= Gold.speed), 0);
              Gold.pos.setVector(rope.tmp2);
              break;
            } else {
              rope.tmp.set((rope.currentLength -= rope.SpeedBack), 0);
            }
          }
          rope.tmp.rotateRad(rope.currentAngle);
          rope.tmp2.setVector(rope.line).addVector(rope.tmp);
          rope.status = false;
        } else {
          rope.Shotting = false;
          for (let i = 0; i < gold.length; i++) {
            const Gold = gold[i];
            if (Gold.hit) {
              Gold.hit = false;
              gold.splice(i, 1);
            }
          }
          rope.status = true;
          rope.LENGTH = 100;
        }
      }
    } else {
      rope.currentAngle += delta * rope.Angle;
      if (
        rope.currentAngle < Math.PI / 10 ||
        rope.currentAngle > (Math.PI * 9) / 10
      ) {
        rope.Angle *= -1;
      }
      rope.tmp.set(rope.LENGTH, 0);
      rope.tmp.rotateRad(rope.currentAngle);
      rope.tmp2.setVector(rope.line).addVector(rope.tmp);
    }
    batch.begin();
    drawLine(
      batch,
      whiteText,
      rope.line.x,
      rope.line.y,
      rope.tmp2.x,
      rope.tmp2.y,
      10
    );
    batch.draw(
      texture,
      rope.tmp2.x - 47,
      rope.tmp2.y - 50,
      100,
      100,
      50,
      50,
      -Math.atan2(rope.tmp2.x - rope.line.x, rope.tmp2.y - rope.line.y)
    );
    batch.end();
  };

  const drawEnvironment = () => {
    batch.setProjection(cam.combined);
    batch.begin();
    batch.draw(whiteText, 0, height / 11, width, 10);
    batch.draw(whiteText, rope.line.x - 25, rope.line.y - 40, 50, 50);
    batch.end();
  };
  const drawGold = pos => {
    batch.setProjection(cam.combined);
    batch.begin();
    batch.draw(whiteText, pos.x - 50, pos.y, 100, 100);
    batch.end();
  };

  gl.clearColor(0, 0, 0, 1);

  const update = delta => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    processMove();
    processState(delta);
    drawEnvironment();
    for (const Gold of gold) {
      drawGold(Gold.pos);
    }
  };

  const game = createGameLoop(update);

  setInterval(() => {
    info.innerHTML = `FPS : ${Math.floor(game.getFps())}`;
  }, 1000);
};

init();
