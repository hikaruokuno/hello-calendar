import React, { FC, useContext, useState } from "react";
import axios from "axios";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import Config from "apiGoogleconfig";

import { format, setSeconds } from "date-fns";
import {
  FirebaseContext,
  EventTypeContext,
  EventsContext,
  EventsCountContext,
} from "./contexts";

const { clientId, clientSecret, apiKey } = Config;

type RestApiResponse = {
  access_token: string; // eslint-disable-line camelcase
  expires_in: number; // eslint-disable-line camelcase
  id_token: string; // eslint-disable-line camelcase
  refresh_token: string; // eslint-disable-line camelcase
  scope: string; // eslint-disable-line camelcase
};

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
  const [loading, setLoading] = useState(true);

  const initClient = () => {
    gapi.client
      .init(Config)
      .then(async () => {
        const timeLimitString = localStorage.getItem("timeLimit");
        if (timeLimitString) {
          const timeLimit = new Date(timeLimitString);
          if (new Date() > timeLimit) {
            const params = new URLSearchParams();
            params.append("client_id", clientId);
            params.append("client_secret", clientSecret);
            params.append("grant_type", "refresh_token");
            params.append(
              "refresh_token",
              localStorage.getItem("refreshTokenKey")!
            );

            await axios
              .post(
                `https://oauth2.googleapis.com/token?key=${apiKey}`,
                params,
                {
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                }
              )
              .then((res) => {
                const data = res.data as RestApiResponse;
                localStorage.setItem("accessTokenKey", data.access_token);
                const newTimeLimit = setSeconds(new Date(), data.expires_in);
                localStorage.setItem(
                  "timeLimit",
                  format(newTimeLimit, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
                );
                gapi.client.setToken({
                  access_token: localStorage.getItem("accessTokenKey")!,
                });
              })
              .catch((err) => {
                // 再ログインを促す または ログアウトする
                console.log(err);
              });
          }
        }

        setLoading(false);
      })
      .catch((e: any) => {
        console.log(e);
      });
  };

  const handleClientLoad = () => {
    gapi.load("client:auth2", initClient);
  };
  handleClientLoad();

  const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  });
  unsubscribe();

  return (
    // <FirebaseContext.Provider value={{ db, auth }}>
    <FirebaseContext.Provider value={{ db, auth, isLoggedIn, loading }}>
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
