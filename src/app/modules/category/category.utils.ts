export const generateSlug = (name: string): string => {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
};
