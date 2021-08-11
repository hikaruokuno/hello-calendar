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
  loading: boolean;
};

export const FirebaseContext = createContext<FirebaseContextValue>({
  auth: null,
  db: null,
  isLoggedIn: false,
  loading: true,
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
  mainEvents: Event[];
  setMainEvents: (events: Event[]) => void;
  mainMEvents: Event[];
  setMainMEvents: (events: Event[]) => void;
  newEvents: Event[];
  setNewEvents: (events: Event[]) => void;
};

export const EventsContext = createContext<EventsValue>({
  weekEvents: [],
  setWeekEvents: () => undefined,
  mainEvents: [],
  setMainEvents: () => undefined,
  mainMEvents: [],
  setMainMEvents: () => undefined,
  newEvents: [],
  setNewEvents: () => undefined,
});

type EventsCountValue = {
  displayCount: number;
  setDisplayCount: (displayCount: number) => void;
};

export const EventsCountContext = createContext<EventsCountValue>({
  displayCount: 5,
  setDisplayCount: () => undefined,
});
