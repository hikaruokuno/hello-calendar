import Firebase from "firebase/app";
import { Performance } from "./performance";

export type Event = {
  id: string;
  title: string;
  performance: Performance | null;
  status: number;
  createdAt: Firebase.firestore.Timestamp | null;
  updatedAt: Firebase.firestore.Timestamp | null;
};

export const blankEvent: Event = {
  id: "",
  title: "",
  performance: null,
  status: 1,
  createdAt: null,
  updatedAt: null,
};
