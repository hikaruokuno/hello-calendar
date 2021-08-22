import firebase from "firebase/app";

export type Event = {
  id: string;
  type: string;
  title: string;
  performer: string | null;
  mc: string | null;
  fee: string | null;
  isConfirmEnded: boolean;
  isApplyEnded: boolean;
  applyPeriodStr: string;
  confirmPeriodStr: string;
  paymentDateStr: string;
  applyStartDate: firebase.firestore.Timestamp | null;
  applyEndDate: firebase.firestore.Timestamp | null;
  confirmStartDate: firebase.firestore.Timestamp | null;
  confirmEndDate: firebase.firestore.Timestamp | null;
  paymentDate: firebase.firestore.Timestamp | null;
  createdAt: firebase.firestore.Timestamp | null;
  updatedAt: firebase.firestore.Timestamp | null;
};

export const blankEvent: Event = {
  id: "",
  type: "",
  title: "",
  performer: null,
  mc: null,
  fee: null,
  isConfirmEnded: false,
  isApplyEnded: false,
  applyPeriodStr: "",
  confirmPeriodStr: "",
  paymentDateStr: "",
  applyStartDate: null,
  applyEndDate: null,
  confirmStartDate: null,
  confirmEndDate: null,
  paymentDate: null,
  createdAt: null,
  updatedAt: null,
};
