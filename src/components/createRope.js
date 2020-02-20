import { Vector2 } from "gdxjs/lib";
export default (width, height) => {
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
    hit: false,
    status: true
  };
  return rope;
};
