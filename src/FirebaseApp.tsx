import React, { FC, useContext, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { User } from "services/hello-calendar/models/user";
// import findUser from 'services/hello-calendar/find-user';
import {
  FirebaseContext,
  EventTypeContext,
  EventsContext,
  EventsCountContext,
} from "./contexts";

const FirebaseApp: FC = ({ children }) => {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const [type, setType] = useState(useContext(EventTypeContext).type);
  const [weekEvents, setWeekEvents] = useState(
    useContext(EventsContext).weekEvents
  );
  const [applyEvents, setApplyEvents] = useState(
    useContext(EventsContext).applyEvents
  );
  const [applyMEvents, setApplyMEvents] = useState(
    useContext(EventsContext).applyMEvents
  );
  const [confirmEvents, setConfirmEvents] = useState(
    useContext(EventsContext).confirmEvents
  );
  const [performances, setPerformances] = useState(
    useContext(EventsContext).performances
  );
  const [confirmMEvents, setConfirmMEvents] = useState(
    useContext(EventsContext).confirmMEvents
  );
  const [applyCount, setApplyCount] = useState(
    useContext(EventsCountContext).applyCount
  );
  const [confirmCount, setConfirmCount] = useState(
    useContext(EventsCountContext).confirmCount
  );

  const [user, setUser] = useState<User | null>(null);
  const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
    console.log(firebaseUser?.uid);
    if (firebaseUser) {
      console.log("firebaseUser");
      console.log(user);
      // if (!user) {
      // create user
      // const theUser = await findUser(db, firebaseUser.uid);
      // setUser(theUser);
      console.log("findUser");
      // }
    } else {
      console.log("clearUser");
      setUser(null);
    }
  });
  unsubscribe();

  return (
    // <FirebaseContext.Provider value={{ db, auth }}>
    <FirebaseContext.Provider value={{ db, auth }}>
      <EventTypeContext.Provider value={{ type, setType }}>
        <EventsContext.Provider
          value={{
            weekEvents,
            setWeekEvents,
            applyEvents,
            setApplyEvents,
            applyMEvents,
            setApplyMEvents,
            confirmEvents,
            setConfirmEvents,
            confirmMEvents,
            setConfirmMEvents,
            performances,
            setPerformances,
          }}
        >
          <EventsCountContext.Provider
            value={{ applyCount, setApplyCount, confirmCount, setConfirmCount }}
          >
            {children}
          </EventsCountContext.Provider>
        </EventsContext.Provider>
      </EventTypeContext.Provider>
    </FirebaseContext.Provider>
  );
};

export default FirebaseApp;
