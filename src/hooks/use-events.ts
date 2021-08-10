import { EventsContext, FirebaseContext } from "contexts";
import { useContext, useEffect, useRef, useState } from "react";
import { Event } from "services/hello-calendar/models/event";

const useEvents = (type: string) => {
  const { mainEvents, setMainEvents, mainMEvents, setMainMEvents } =
    useContext(EventsContext);
  const [mainLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const firebaseRef = useRef(useContext(FirebaseContext));

  useEffect(() => {
    const { db } = firebaseRef.current;
    if (!db) throw new Error("Firestore is not initialized");
    console.log("main");
    if (
      (type === "hEvents" && mainEvents.length !== 0) ||
      (type === "mEvents" && mainMEvents.length !== 0)
    ) {
      return;
    }

    const query = db.collection(type).orderBy("id", "desc").limit(30);

    const load = async () => {
      setLoading(true);

      try {
        const snap = await query.get();
        const eventsData = snap.docs.map((doc) => ({
          ...(doc.data() as Event),
          id: doc.id,
        }));
        if (type === "hEvents" && eventsData.length !== 0) {
          setMainEvents(eventsData);
        } else if (type === "mEvents" && eventsData.length !== 0) {
          setMainMEvents(eventsData);
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
  }, [type, mainEvents, setMainEvents, mainMEvents, setMainMEvents]);

  return { mainEvents, mainMEvents, mainLoading, error };
};

export default useEvents;
