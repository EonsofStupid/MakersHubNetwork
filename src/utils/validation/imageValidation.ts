export const ACCEPTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
  'image/jxl',
  'image/heic',
  'image/heif',
  'image/tiff',
  'image/svg+xml'
];

export const validateImageFile = (file: File): boolean => {
  return ACCEPTED_IMAGE_FORMATS.includes(file.type);
};

export const validateImageCount = (currentCount: number, maxCount: number = 7): boolean => {
  return currentCount < maxCount;
};