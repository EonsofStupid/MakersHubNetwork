export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ImageUploadResult {
  url: string;
  error?: string;
}