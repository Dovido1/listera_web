import sharp from "sharp";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");

// Redimensionner une image
export const resizeImage = async (filePath, width, height) => {
  const outputPath = path.join(uploadDir, `resized-${Date.now()}.jpg`);
  await sharp(filePath)
    .resize(width, height)
    .toFormat("jpeg")
    .toFile(outputPath);
  return outputPath;
};

// Recadrer une image
export const cropImage = async (filePath, width, height) => {
  const outputPath = path.join(uploadDir, `cropped-${Date.now()}.jpg`);
  await sharp(filePath)
    .extract({ left: 0, top: 0, width, height })
    .toFile(outputPath);
  return outputPath;
};

// Supprimer l’arrière-plan (exemple avec une lib externe)
export const removeBackground = async (filePath) => {
  // Ici tu peux utiliser une API comme remove.bg
  // Exemple fictif : appel API
  return filePath; // Pour l’instant on renvoie le chemin original
};