/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from "react";
import firebase from "firebase/app";
import "firebase/firestore";

type FirebaseContextValue = {
  db: firebase.firestore.Firestore | null;
};

const FirebaseContext = createContext<FirebaseContextValue>({
  db: null,
});

export default FirebaseContext;
