import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyA6GLJipum08T4ALZovBiwj3HMse1pZpXo",
  authDomain: "la-flor-creation.firebaseapp.com",
  projectId: "la-flor-creation",
  storageBucket: "la-flor-creation.appspot.com",
  messagingSenderId: "573064101523",
  appId: "1:573064101523:web:9c56ad7e3da07836e7d766",
  measurementId: "G-1CG1BGFGNV"
};

const app = initializeApp(firebaseConfig);

export default app;