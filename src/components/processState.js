import { drawLine } from "gdxjs/lib";
let index = 0;
export default (
  delta,
  batch,
  whiteText,
  rope,
  golds,
  width,
  height,
  img,
  setScore
) => {
  if (rope.Shotting) {
    if (rope.status) {
      rope.tmp.set((rope.LENGTH += rope.Speed), 0);
      rope.tmp.rotateRad(rope.currentAngle);
      rope.tmp2.setVector(rope.line).addVector(rope.tmp);
    }
    for (let i = 0; i < golds.length; i++) {
      const gold = golds[i];
      if (
        !rope.hit &&
        Math.floor(
          Math.sqrt(
            (rope.tmp2.x - gold.pos.x) * (rope.tmp2.x - gold.pos.x) +
              (rope.tmp2.y - gold.pos.y) * (rope.tmp2.y - gold.pos.y)
          )
        ) <=
          img.imageHeight / 2 + gold.goldHeight / 2
      ) {
        rope.status = false;
        index = i;
        rope.hit = true;
        rope.currentLength = rope.LENGTH;
        break;
      }
    }
    if (
      rope.status &&
      rope.tmp2.x > -img.imageWidth &&
      rope.tmp2.x < width + img.imageWidth &&
      rope.tmp2.y < height + img.imageHeight
    ) {
      rope.currentLength = rope.LENGTH;
    } else {
      if (rope.currentLength > 100) {
        if (golds.length > 0) {
          if (rope.hit) {
            rope.tmp.set((rope.currentLength -= golds[index].speed), 0);
            golds[index].pos.setVector(rope.tmp2);
          } else {
            rope.tmp.set((rope.currentLength -= rope.SpeedBack), 0);
          }
        } else {
          rope.tmp.set((rope.currentLength -= rope.SpeedBack), 0);
        }
        rope.tmp.rotateRad(rope.currentAngle);
        rope.tmp2.setVector(rope.line).addVector(rope.tmp);
        rope.status = false;
      } else {
        if (rope.hit) {
          setScore(golds[index].score);
          rope.hit = false;
          golds.splice(index, 1);
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
    img.texture,
    rope.tmp2.x - width / 15.98,
    rope.tmp2.y - height / 26.68,
    img.imageWidth,
    img.imageHeight,
    img.imageWidth / 2,
    img.imageHeight / 2,
    -Math.atan2(rope.tmp2.x - rope.line.x, rope.tmp2.y - rope.line.y)
  );
  batch.end();
};
