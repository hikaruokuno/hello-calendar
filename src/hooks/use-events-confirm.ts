import { EventsContext, FirebaseContext } from "contexts";
import { useContext, useEffect, useRef, useState } from "react";
import { Event } from "services/hello-calendar/models/event";
// import { startOfDay } from 'date-fns';

const useEventsConfirm = (type: string) => {
  const { confirmEvents, setConfirmEvents } = useContext(EventsContext);
  const { confirmMEvents, setConfirmMEvents } = useContext(EventsContext);
  const [confirmLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const firebaseRef = useRef(useContext(FirebaseContext));

  useEffect(() => {
    if (
      (type === "hEvents" && confirmEvents.length !== 0) ||
      (type === "mEvents" && confirmMEvents.length !== 0)
    ) {
      return;
    }
    const { db } = firebaseRef.current;
    if (!db) throw new Error("Firestore is not initialized");

    const query = db
      .collection(type)
      .where("isConfirmEnded", "==", false)
      .where("confirmStartDate", "<=", new Date())
      .orderBy("confirmStartDate", "desc");
    // .orderBy('isConfirmEnded');

    const load = async () => {
      setLoading(true);

      try {
        const snap = await query.get();
        const eventsData = snap.docs.map((doc) => ({
          ...(doc.data() as Event),
          id: doc.id,
        }));
        if (type === "hEvents" && eventsData.length !== 0) {
          setConfirmEvents(eventsData);
        } else if (type === "mEvents" && eventsData.length !== 0) {
          setConfirmMEvents(eventsData);
        }
        setError(null);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };

    load().catch((err) => {
      console.error(err);
    });
  }, [
    type,
    confirmEvents,
    setConfirmEvents,
    confirmMEvents,
    setConfirmMEvents,
  ]);

  return { confirmEvents, confirmMEvents, confirmLoading, error };
};

export default useEventsConfirm;
