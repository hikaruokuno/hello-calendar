import { FirebaseContext } from "contexts";
import { useContext, useEffect, useRef, useState } from "react";
import { Event } from "services/hello-calendar/models/event";
import { EventDetail } from "services/hello-calendar/models/eventDetail";

const useEventDetails = (type: string, id: string) => {
  const [event, setEvent] = useState<Event>();
  const [eventDetails, setEventDetails] = useState<EventDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const collectionName = type === "hello" ? "hEvents" : "mEvents";

  const firebaseRef = useRef(useContext(FirebaseContext));

  useEffect(() => {
    const { db } = firebaseRef.current;
    if (!db) throw new Error("Firestore is not initialized");

    const eventQuery = db.collection(collectionName).doc(id);

    const details = db
      .collection(collectionName)
      .doc(id)
      .collection("eventDetails")
      .orderBy("performanceDate", "asc");

    const load = async () => {
      setLoading(true);

      try {
        const snapEvent = await eventQuery.get();
        const eventData = snapEvent.data() as Event;

        const snapDetails = await details.get();
        const eventDetailsData = snapDetails.docs.map((doc) => ({
          ...(doc.data() as EventDetail),
          id: doc.id,
        }));

        setEvent({ ...eventData, id: snapEvent.id });
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
  }, [id, collectionName]);

  return { event, eventDetails, loading, error };
};

export default useEventDetails;
