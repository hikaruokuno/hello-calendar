/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from "react";
import firebase from "firebase/app";
import "firebase/firestore";

type FirebaseContextValue = {
  db: firebase.firestore.Firestore | null;
};

export const FirebaseContext = createContext<FirebaseContextValue>({
  db: null,
});

type EventTypeContextValue = {
  type: string;
  setType: (type: string) => void;
};

export const EventTypeContext = createContext<EventTypeContextValue>({
  type: "hEvents",
  setType: () => undefined,
});
