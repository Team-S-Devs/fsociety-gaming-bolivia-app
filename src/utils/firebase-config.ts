import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
export const auth = getAuth(app);
export const db = getFirestore(app);