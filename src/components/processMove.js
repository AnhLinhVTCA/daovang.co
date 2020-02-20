const speed = 400;
export default (moveLeft, rope, moveRight, width, delta) => {
  if (moveLeft && rope.line.x > 25) {
    rope.line.x -= speed * delta;
  } else if (moveRight && rope.line.x < width - 25) {
    rope.line.x += speed * delta;
  }
};
