import Firebase from "firebase/app";

export type Event = {
  id: string;
  title: string;
  status: number;
  createdAt: Firebase.firestore.Timestamp | null;
  updatedAt: Firebase.firestore.Timestamp | null;
};

export const blankEvent: Event = {
  id: "",
  title: "",
  status: 1,
  createdAt: null,
  updatedAt: null,
};
