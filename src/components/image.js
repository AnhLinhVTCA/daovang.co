import { loadTexture } from "gdxjs/lib";
export default async (gl, width, height) => {
  const image = {
    texture: await loadTexture(
      gl,
      "./—Pngtree—anchor tattoo pattern_5062747.png"
    ),
    imageWidth: width / 7.5,
    imageHeight: height / 13.34
  };
  return image;
};
