import { EventsContext, FirebaseContext } from "contexts";
import { useContext, useEffect, useRef, useState } from "react";
import { Event } from "services/hello-calendar/models/event";
// import { startOfDay } from 'date-fns';

const useEventsApply = (type: string) => {
  const { applyEvents, setApplyEvents } = useContext(EventsContext);
  const { applyMEvents, setApplyMEvents } = useContext(EventsContext);
  const [applyLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const firebaseRef = useRef(useContext(FirebaseContext));

  useEffect(() => {
    if (
      (type === "hEvents" && applyEvents.length !== 0) ||
      (type === "mEvents" && applyMEvents.length !== 0)
    ) {
      return;
    }
    const { db } = firebaseRef.current;
    if (!db) throw new Error("Firestore is not initialized");

    const query = db
      .collection(type)
      .where("isApplyEnded", "==", false)
      .where("applyStartDate", "<=", new Date())
      .orderBy("applyStartDate", "desc");

    const load = async () => {
      setLoading(true);

      try {
        const snap = await query.get();
        const eventsData = snap.docs.map((doc) => ({
          ...(doc.data() as Event),
          id: doc.id,
        }));
        if (type === "hEvents") {
          setApplyEvents(eventsData);
        } else {
          setApplyMEvents(eventsData);
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
  }, [type, applyEvents, setApplyEvents, applyMEvents, setApplyMEvents]);

  return { applyEvents, applyLoading, error, applyMEvents };
};

export default useEventsApply;
