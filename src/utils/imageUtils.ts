
/**
 * Utility functions for handling images
 */

/**
 * Convert a File to a data URL
 * @param file The file to convert
 * @returns A promise that resolves to the data URL
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Validate that a file is an image and within size limits
 * @param file The file to validate
 * @param maxSizeMB Maximum file size in MB
 * @returns An error message if invalid, or null if valid
 */
export const validateImageFile = (file: File, maxSizeMB = 2): string | null => {
  // Check if file is an image
  if (!file.type.startsWith('image/')) {
    return 'File must be an image';
  }
  
  // Check file size (default max 2MB)
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `Image must be smaller than ${maxSizeMB}MB`;
  }
  
  return null;
};
