import firebase from "firebase/app";

import { collectionName } from "constants/constants";
import { User } from "./models/user";

const findUser = async (db: firebase.firestore.Firestore, id: string) => {
  let theUser: User | null = null;
  const userDoc = await db.collection(collectionName.users).doc(id).get();

  if (userDoc.exists) {
    const user = userDoc.data() as User;
    theUser = { ...user, id: userDoc.id };
  } else {
    const user: User = {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    theUser = { ...user, id: userDoc.id };
  }

  return theUser;
};

export default findUser;
