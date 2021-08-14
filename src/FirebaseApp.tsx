import React, { FC, useContext, useState } from "react";
import axios from "axios";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import Config from "apiGoogleconfig";

import { addYears, format, setSeconds } from "date-fns";
import { get, set } from "services/hello-calendar/CookieServise";
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
  const [type, setType] = useState(useContext(EventTypeContext).type);
  const [weekEvents, setWeekEvents] = useState(
    useContext(EventsContext).weekEvents
  );
  const [mainEvents, setMainEvents] = useState(
    useContext(EventsContext).mainEvents
  );
  const [mainMEvents, setMainMEvents] = useState(
    useContext(EventsContext).mainMEvents
  );
  const [newEvents, setNewEvents] = useState(
    useContext(EventsContext).newEvents
  );
  const [displayCount, setDisplayCount] = useState(
    useContext(EventsCountContext).displayCount
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
            params.append("refresh_token", get("refreshTokenKey")!);

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
                set("accessTokenKey", data.access_token, {
                  path: "/",
                  expires: addYears(new Date(), 1),
                });
                const newTimeLimit = setSeconds(new Date(), data.expires_in);
                localStorage.setItem(
                  "timeLimit",
                  format(newTimeLimit, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
                );
                gapi.client.setToken({
                  access_token: data.access_token,
                });
                setLoading(false);
              })
              .catch((err) => {
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
    <FirebaseContext.Provider value={{ db, auth, isLoggedIn, loading }}>
      <EventTypeContext.Provider value={{ type, setType }}>
        <EventsContext.Provider
          value={{
            weekEvents,
            setWeekEvents,
            mainEvents,
            setMainEvents,
            mainMEvents,
            setMainMEvents,
            newEvents,
            setNewEvents,
          }}
        >
          <EventsCountContext.Provider
            value={{ displayCount, setDisplayCount }}
          >
            {children}
          </EventsCountContext.Provider>
        </EventsContext.Provider>
      </EventTypeContext.Provider>
    </FirebaseContext.Provider>
  );
};

export default FirebaseApp;
