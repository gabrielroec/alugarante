import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";

// Configuração de armazenamento para os uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Diretório onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
    // Usa o nome do campo (file.fieldname) e um timestamp para nomear o arquivo
    const uniqueSuffix = `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  },
});

// Filtro para limitar o tipo de arquivos aceitos
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Aceita o arquivo
  } else {
    cb(new Error("Tipo de arquivo não suportado"));
  }
};

// Configuração do multer para aceitar múltiplos campos
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;
