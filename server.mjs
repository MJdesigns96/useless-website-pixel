import sharp from "sharp";

let count = 3;

export default function convertImage(img) {
    sharp(img)
    .resize(256, 256)
    .toFile(`images/newImg${count}.png`);
};

sharp("./images/ameenfahmy-gcWd0ts4RCo-unsplash.jpg")
.resize(256,256)
.toFile("images/newImg2.png")