import Firebase from "firebase/app";

export type EventDetail = {
  id: string;
  title: string;
  performanceDay: string;
  performer: string | null;
  venue: string;
  openingTime: string;
  showTime: string;
  createdAt: Firebase.firestore.Timestamp | null;
  updatedAt: Firebase.firestore.Timestamp | null;
};

export const blankEventDetail: EventDetail = {
  id: "",
  title: "",
  performanceDay: "",
  performer: null,
  venue: "",
  openingTime: "",
  showTime: "",
  createdAt: null,
  updatedAt: null,
};
