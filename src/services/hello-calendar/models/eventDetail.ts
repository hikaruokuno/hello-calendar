import Firebase from "firebase/app";

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
  performanceDate: Firebase.firestore.Timestamp | null;
  createdAt: Firebase.firestore.Timestamp | null;
  updatedAt: Firebase.firestore.Timestamp | null;
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
