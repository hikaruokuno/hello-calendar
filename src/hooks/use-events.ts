import { FirebaseContext } from "contexts";
import { useContext, useEffect, useRef, useState } from "react";
import { Event } from "services/hello-calendar/models/event";

const useEvents = (type: string) => {
  const [mainEvents, setEvents] = useState<Event[]>([]);
  const [mainLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const firebaseRef = useRef(useContext(FirebaseContext));

  useEffect(() => {
    const { db } = firebaseRef.current;
    if (!db) throw new Error("Firestore is not initialized");

    const query = db.collection(type).orderBy("id", "desc");

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

  return { mainEvents, mainLoading, error };
};

export default useEvents;
