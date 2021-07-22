import React, { FC, useContext, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import Config from "apiGoogleconfig";

import {
  FirebaseContext,
  EventTypeContext,
  EventsContext,
  EventsCountContext,
} from "./contexts";

const initClient = () => {
  gapi.client
    .init(Config)
    .then(() => {
      console.log("signIn", gapi.auth2.getAuthInstance().isSignedIn.get());
    })
    .catch((e: any) => {
      console.log(e);
    });
};

const handleClientLoad = () => {
  const script = document.createElement("script");
  script.src = "https://apis.google.com/js/api.js";
  document.body.appendChild(script);
  script.onload = (): void => {
    gapi.load("client:auth2", initClient);
  };
};
handleClientLoad();

const FirebaseApp: FC = ({ children }) => {
  const auth = firebase.auth();
  const db = firebase.firestore();
  // const counterRef = useRef(0);
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
  const [isLoggedIn, setLogin] = useState(false);
  const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
    if (firebaseUser && gapi.auth2.getAuthInstance().isSignedIn.get()) {
      console.log("loggedIn");
      console.log(firebaseUser);
      setLogin(true);
    } else {
      setLogin(false);
      console.log("loggedOut");
    }
  });
  unsubscribe();

  return (
    // <FirebaseContext.Provider value={{ db, auth }}>
    <FirebaseContext.Provider value={{ db, auth, isLoggedIn }}>
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
