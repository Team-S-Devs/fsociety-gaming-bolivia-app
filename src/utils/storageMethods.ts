import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "./firebase-config";

/**
 * Uploads a file to Firebase Cloud Storage.
 * @param file - The file to upload.
 * @param uploadPath - The storage path where the file will be uploaded.
 * @returns A Promise that resolves when the upload is complete.
 */
export const uploadFileToStorage = async (
  file: File,
  uploadPath: string
): Promise<string> => {
  if (!file) {
    return "";
  }
  try {
    const storageRef = ref(storage, uploadPath);
    await uploadBytes(storageRef, file);

    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    return "";
  }
};
