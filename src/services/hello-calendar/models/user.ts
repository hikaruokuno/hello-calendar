import Firebase from "firebase/app";

export type User = {
  id?: string;
  createdAt: Firebase.firestore.FieldValue | null;
  updatedAt: Firebase.firestore.FieldValue | null;
};

export const blankUser: User = {
  createdAt: null,
  updatedAt: null,
};
