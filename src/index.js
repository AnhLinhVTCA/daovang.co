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
  const image = {
    texture: await loadTexture(
      gl,
      "./—Pngtree—anchor tattoo pattern_5062747.png"
    ),
    imageWidth: width / 7.5,
    imageHeight: height / 13.34
  };
  const rope = {
    Shotting: false,
    LENGTH: width / 7.5,
    Angle: Math.PI / 3,
    currentAngle: Math.PI / 4,
    line: new Vector2(width / 2, height / 11),
    tmp: new Vector2(100, 0),
    tmp2: new Vector2(0, 0),
    Speed: width / 140,
    SpeedBack: width / 160,
    currentLength: 0,
    status: true
  };

  const inputHandler = new InputHandler(canvas);
  let moveLeft = false;
  let moveRight = false;

  const gold = [];
  for (let i = 0; i < 3; i++) {
    gold.push({
      pos: new Vector2(
        Math.random() * (width - width / 7) + width / 7,
        Math.random() * (height - 100 - height / 3) + height / 3
      ),
      goldWidth: width / 7,
      goldHeight: height / 14,
      speed: 1,
      score: Math.round(Math.random() * 4 + 1),
      hit: false
    });
  }

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
  let score = 0;
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
          ) <=
            image.imageHeight / 2 + Gold.goldHeight / 2
        ) {
          rope.status = false;
          Gold.hit = true;
          rope.currentLength = rope.LENGTH;
          break;
        }
      }
      if (
        rope.status &&
        rope.tmp2.x > -image.imageWidth &&
        rope.tmp2.x < width + image.imageWidth &&
        rope.tmp2.y < height + image.imageHeight
      ) {
        rope.currentLength = rope.LENGTH;
      } else {
        if (rope.currentLength > 100) {
          if (gold.length > 0) {
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
          } else {
            rope.tmp.set((rope.currentLength -= rope.SpeedBack), 0);
          }
          rope.tmp.rotateRad(rope.currentAngle);
          rope.tmp2.setVector(rope.line).addVector(rope.tmp);
          rope.status = false;
        } else {
          for (let i = 0; i < gold.length; i++) {
            const Gold = gold[i];
            if (Gold.hit) {
              score += Gold.score;
              Gold.hit = false;
              gold.splice(i, 1);
              break;
            }
          }
          rope.Shotting = false;
          rope.status = true;
          rope.LENGTH = width / 7.5;
        }
      }
    } else {
      rope.currentAngle += delta * rope.Angle;
      if (rope.currentAngle >= (Math.PI * 9) / 10) {
        rope.currentAngle = (Math.PI * 9) / 10;
        rope.Angle *= -1;
      } else if (rope.currentAngle <= Math.PI / 10) {
        rope.currentAngle = Math.PI / 10;
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
      width / 75
    );
    batch.draw(
      image.texture,
      rope.tmp2.x - width / 15.98,
      rope.tmp2.y - height / 26.68,
      image.imageWidth,
      image.imageHeight,
      image.imageWidth / 2,
      image.imageHeight / 2,
      -Math.atan2(rope.tmp2.x - rope.line.x, rope.tmp2.y - rope.line.y)
    );
    batch.end();
  };

  const drawEnvironment = () => {
    batch.setProjection(cam.combined);
    batch.begin();
    batch.draw(whiteText, 0, height / 11, width, height / 100);
    batch.draw(
      whiteText,
      rope.line.x - width / 30,
      rope.line.y - height / 30,
      width / 15,
      height / 30
    );
    batch.end();
  };
  const drawGold = gold => {
    batch.setProjection(cam.combined);
    batch.begin();
    batch.draw(
      whiteText,
      gold.pos.x - gold.goldWidth / 2,
      gold.pos.y,
      gold.goldWidth,
      gold.goldHeight
    );
    batch.end();
  };

  gl.clearColor(0, 0, 0, 1);

  const update = delta => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    processMove();
    processState(delta);
    drawEnvironment();
    for (const Gold of gold) {
      drawGold(Gold);
    }
  };

  const game = createGameLoop(update);

  setInterval(() => {
    info.innerHTML = `FPS : ${Math.floor(game.getFps())} - Score : ${score}`;
  }, 500);
};

init();
