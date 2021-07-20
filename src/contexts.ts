/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import { Event } from "services/hello-calendar/models/event";

type FirebaseContextValue = {
  auth: firebase.auth.Auth | null;
  db: firebase.firestore.Firestore | null;
  isLoggedIn: boolean;
  credential: firebase.auth.OAuthCredential | null;
  setCredential: (credential: firebase.auth.OAuthCredential | null) => void;
};

export const FirebaseContext = createContext<FirebaseContextValue>({
  auth: null,
  db: null,
  isLoggedIn: false,
  credential: null,
  setCredential: () => undefined,
});

type EventTypeContextValue = {
  type: string;
  setType: (type: string) => void;
};

export const EventTypeContext = createContext<EventTypeContextValue>({
  type: "hEvents",
  setType: () => undefined,
});

type EventsValue = {
  weekEvents: EventDetail[];
  setWeekEvents: (events: EventDetail[]) => void;
  applyEvents: Event[];
  setApplyEvents: (events: Event[]) => void;
  applyMEvents: Event[];
  setApplyMEvents: (events: Event[]) => void;
  confirmEvents: Event[];
  setConfirmEvents: (events: Event[]) => void;
  confirmMEvents: Event[];
  setConfirmMEvents: (events: Event[]) => void;
  performances: EventDetail[];
  setPerformances: (events: EventDetail[]) => void;
};

export const EventsContext = createContext<EventsValue>({
  weekEvents: [],
  setWeekEvents: () => undefined,
  applyEvents: [],
  setApplyEvents: () => undefined,
  applyMEvents: [],
  setApplyMEvents: () => undefined,
  confirmEvents: [],
  setConfirmEvents: () => undefined,
  confirmMEvents: [],
  setConfirmMEvents: () => undefined,
  performances: [],
  setPerformances: () => undefined,
});

type EventsCountValue = {
  applyCount: number;
  setApplyCount: (applyCount: number) => void;
  confirmCount: number;
  setConfirmCount: (applyCount: number) => void;
};

export const EventsCountContext = createContext<EventsCountValue>({
  applyCount: 3,
  setApplyCount: () => undefined,
  confirmCount: 3,
  setConfirmCount: () => undefined,
});
