import React, { FC, useContext, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { FirebaseContext, EventTypeContext } from "./contexts";

const FirebaseApp: FC = ({ children }) => {
  const db = firebase.firestore();
  const initTypeValue = useContext(EventTypeContext).type;
  const [type, setType] = useState(initTypeValue);

  return (
    <FirebaseContext.Provider value={{ db }}>
      <EventTypeContext.Provider value={{ type, setType }}>
        {children}
      </EventTypeContext.Provider>
    </FirebaseContext.Provider>
  );
};

export default FirebaseApp;
