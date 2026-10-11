
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJ-R5lnvqKVV3bar_kpjOeA2NSbYSAqK8",
  authDomain: "notion-clone-34e87.firebaseapp.com",
  projectId: "notion-clone-34e87",
  storageBucket: "notion-clone-34e87.firebasestorage.app",
  messagingSenderId: "86965700200",
  appId: "1:86965700200:web:207152ba4ab29b158d9ddd"
};

const app = getApps().length==0 ? initializeApp(firebaseConfig): getApp();
const db = getFirestore(app);

export {db};