import * as bcrypt from "bcrypt";
import config from "../config";

export const getCurrentFilename = (filePath: string) => {
  const fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
  return fileName.substring(0, fileName.lastIndexOf("."));
};

export const generateErrSource = (filePath: string, funcName: string) => {
  return `${getCurrentFilename(filePath)}: ${funcName}`;
};

export const hashedText = async (text: string) => {
  return await bcrypt.hash(text, Number(config.bcrypt_salt_rounds) || 10);
};
