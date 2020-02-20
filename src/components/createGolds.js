import { Vector2 } from "gdxjs/lib";
const golds = [];

export default (width, height) => {
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
  return golds;
};
