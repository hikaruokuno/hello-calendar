import firebase from "firebase/app";

export type EventDetail = {
  id: string;
  title: string;
  performanceDay: string;
  venue: string;
  openingTime: string;
  showTime: string;
  openText: string;
  showText: string;
  otherText: string | null;
  otherDetail: string | null;
  performer: string | null;
  performanceDate: firebase.firestore.Timestamp | null;
  createdAt: firebase.firestore.Timestamp | null;
  updatedAt: firebase.firestore.Timestamp | null;
};

export const blankEventDetail: EventDetail = {
  id: "",
  title: "",
  performanceDay: "",
  venue: "",
  openingTime: "",
  showTime: "",
  openText: "",
  showText: "",
  otherText: null,
  otherDetail: null,
  performer: null,
  performanceDate: null,
  createdAt: null,
  updatedAt: null,
};
