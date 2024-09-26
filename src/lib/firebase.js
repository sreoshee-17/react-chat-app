import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB0PbU8CbPI4oK_v52NUZ1izz-g_3itqSA",
  authDomain: "reactchatapp-3f4ff.firebaseapp.com",
  projectId: "reactchatapp-3f4ff",
  storageBucket: "reactchatapp-3f4ff.appspot.com",
  messagingSenderId: "449104289054",
  appId: "1:449104289054:web:d10ade9175ded23d5b7d0f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)