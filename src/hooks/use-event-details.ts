import FirebaseContext from "contexts";
import { useContext, useEffect, useRef, useState } from "react";
import { EventDetail } from "services/hello-calendar/models/eventDetail";

const useEventDetails = (id: string) => {
  const [title, setTitle] = useState("");
  const [performer, setPerformer] = useState<string | null>("");
  const [eventDetails, setEventDetails] = useState<EventDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const firebaseRef = useRef(useContext(FirebaseContext));

  useEffect(() => {
    const { db } = firebaseRef.current;
    if (!db) throw new Error("Firestore is not initialized");

    const collection = db
      .collection("hEvents")
      .doc(id)
      .collection("eventDetails");

    const load = async () => {
      setLoading(true);

      try {
        const snap = await collection.get();
        const eventDetailsData = snap.docs.map((doc) => ({
          ...(doc.data() as EventDetail),
          id: doc.id,
        }));
        setTitle(eventDetailsData[0].title);
        setPerformer(eventDetailsData[0].performer);
        setEventDetails(eventDetailsData);
        setError(null);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };

    load().catch((err) => {
      console.error(err);
    });
  }, [id]);

  return { title, performer, eventDetails, loading, error };
};

export default useEventDetails;
