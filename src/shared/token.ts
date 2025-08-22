import crypto from "crypto";

export const generateMagicToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const getTokenExpiry = (minutes = 30) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};
