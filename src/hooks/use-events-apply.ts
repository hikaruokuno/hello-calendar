import { FirebaseContext } from "contexts";
import { useContext, useEffect, useRef, useState } from "react";
import { Event } from "services/hello-calendar/models/event";
// import { startOfDay } from 'date-fns';

const useEventsApply = (type: string) => {
  const [applyEvents, setEvents] = useState<Event[]>([]);
  const [applyLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const firebaseRef = useRef(useContext(FirebaseContext));

  useEffect(() => {
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
        setEvents(eventsData);
        setError(null);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };

    load().catch((err) => {
      console.error(err);
    });
  }, [type]);

  return { applyEvents, applyLoading, error };
};

export default useEventsApply;
