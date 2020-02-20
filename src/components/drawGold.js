export default (batch, whiteText, cam, gold) => {
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
