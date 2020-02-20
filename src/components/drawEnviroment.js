export default (batch, whiteText, cam, rope, width, height) => {
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
