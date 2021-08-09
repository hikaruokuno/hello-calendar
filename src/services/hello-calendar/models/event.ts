import Firebase from "firebase/app";

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
  applyStartDate: Firebase.firestore.Timestamp | null;
  applyEndDate: Firebase.firestore.Timestamp | null;
  confirmStartDate: Firebase.firestore.Timestamp | null;
  confirmEndDate: Firebase.firestore.Timestamp | null;
  paymentDate: Firebase.firestore.Timestamp | null;
  createdAt: Firebase.firestore.FieldValue | null;
  updatedAt: Firebase.firestore.FieldValue | null;
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
