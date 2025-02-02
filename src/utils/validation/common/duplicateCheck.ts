export const validateDuplicateFile = (newFile: File, existingFiles: File[]): boolean => {
  return !existingFiles.some(existingFile => 
    existingFile.name === newFile.name && 
    existingFile.size === newFile.size
  );
};