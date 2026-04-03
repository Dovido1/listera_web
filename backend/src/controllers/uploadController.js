import { resizeImage, cropImage, removeBackground } from "../services/imageService.js";

export const processImage = async (req, res) => {
  try {
    const filePath = req.file.path;
    const { action, width, height } = req.body;

    let resultPath;
    if (action === "resize") {
      resultPath = await resizeImage(filePath, parseInt(width), parseInt(height));
    } else if (action === "crop") {
      resultPath = await cropImage(filePath, parseInt(width), parseInt(height));
    } else if (action === "remove-bg") {
      resultPath = await removeBackground(filePath);
    } else {
      return res.status(400).json({ message: "Action non reconnue" });
    }

    res.json({ message: "Image traitée avec succès", path: resultPath });
  } catch (err) {
    res.status(500).json({ message: "Erreur traitement image", error: err.message });
  }
};