import app from "./config";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
 
export const firebaseAuth = getAuth(app);
export const firebaseStorage = getStorage(app);