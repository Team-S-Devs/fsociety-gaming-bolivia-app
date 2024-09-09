import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDIOTH4Up2XcleJDCgW2HiNCnWHOhgAWLU",
  authDomain: "fsociety-gaming-bolivia.firebaseapp.com",
  projectId: "fsociety-gaming-bolivia",
  storageBucket: "fsociety-gaming-bolivia.appspot.com",
  messagingSenderId: "395522888773",
  appId: "1:395522888773:web:58f4939f68e0f3f8713f2c",
  measurementId: "G-GTZRSY2XGE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage }