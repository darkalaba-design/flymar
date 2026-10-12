import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
const f8 = "START/Актуальное F8 1 часть/Актуальное F8 1 часть";
const f82 = "START/Актуальное F8 2 часть/Актуальное F8 2 часть";
const f11 = "START/Актуальное F11/Актуальное F11";
const assets = {
  hero: [f8, "А01.jpg"],
  "hero-open-water": [f8, "А3.jpg"],
  "hero-city": [f8, "ии7.png"],
  vessel: [f8, "Вид2.jpg"],
  intelligence: [f8, "ии10.png"],
  interior: [f8, "Интерьер1.jpeg"],
  urban: [f82, "пассажиры3.jpg"],
  leisure: [f82, "пассажиры.jpg"],
  foils: [f82, "крыло3.png"],
  motor: [f8, "двигатель3.png"],
  marina: [f82, "Причал.jpg"],
  autonomy: [f82, "Ф4.jpg"],
  "f8-cockpit": [f82, "Интерьер9.jpg"],
  "f8-boarding": [f82, "пассажиры4.jpg"],
  "f8-profile": [f8, "Вид сбоку2.png"],
  "f11-hero": [f11, "1.jpg"],
  "f11-specifications": [f11, "2.jpg"],
  "f11-views": [f11, "3.jpg"],
  "f11-plan": [f11, "4.jpg"],
  "f11-profile": [f11, "5.jpg"],
  "f11-interior": [f11, "6.jpg"],
  "urban-marina": [f82, "Причал10.jpg"],
  "resort-arrival": [f82, "пассажиры2.jpg"],
};
await fs.mkdir("public/media", { recursive: true });
for (const [name, parts] of Object.entries(assets)) {
  await sharp(path.join(...parts))
    .resize({
      width: name.startsWith("hero") ? 2400 : 1600,
      withoutEnlargement: true,
    })
    .webp({ quality: 87 })
    .toFile(`public/media/${name}.webp`);
}
await fs.copyFile(
  "START/Flymar_Logotype (1)/Logotype/Flymar_Logo.svg",
  "public/media/logo.svg",
);
await fs.copyFile(
  "START/Flymar_Logotype (1)/Icon/Icon-1.svg",
  "src/app/icon.svg",
);
console.log(
  `Prepared ${Object.keys(assets).length} optimized photographs and original brand assets.`,
);
