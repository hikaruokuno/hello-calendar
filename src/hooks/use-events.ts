import FirebaseContext from "contexts";
import { useContext, useEffect, useRef, useState } from "react";
import { Event } from "services/hello-calendar/models/event";

const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const firebaseRef = useRef(useContext(FirebaseContext));

  useEffect(() => {
    const { db } = firebaseRef.current;
    if (!db) throw new Error("Firestore is not initialized");

    // TODO: ひきすうにファンクラブの種別をもらい、M-lineとの切り替えできるようにする
    const query = db.collection("hEvents");

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
  }, []);

  return { events, loading, error };
};

export default useEvents;
