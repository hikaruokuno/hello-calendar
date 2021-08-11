/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EventsContext, FirebaseContext } from "contexts";
import { subDays } from "date-fns";
import { useContext, useEffect, useRef, useState } from "react";
import { Event } from "services/hello-calendar/models/event";

const useEventsNew = () => {
  const { newEvents, setNewEvents } = useContext(EventsContext);
  const [newLoading, setNewLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const firebaseRef = useRef(useContext(FirebaseContext));

  useEffect(() => {
    const { db } = firebaseRef.current;
    if (!db) throw new Error("Firestore is not initialized");
    if (newEvents.length !== 0) {
      return;
    }

    const hQuery = db
      .collection("hEvents")
      .where("createdAt", ">=", subDays(new Date(), 3))
      .orderBy("createdAt", "desc")
      .limit(5);
    const mQuery = db
      .collection("mEvents")
      .where("createdAt", ">=", subDays(new Date(), 3))
      .orderBy("createdAt", "desc")
      .limit(5);

    const load = async () => {
      setNewLoading(true);

      try {
        const hSnap = await hQuery.get();
        const mSnap = await mQuery.get();
        const hEventsData = hSnap.docs.map((doc) => ({
          ...(doc.data() as Event),
          id: doc.id,
        }));
        const mEventsData = mSnap.docs.map((doc) => ({
          ...(doc.data() as Event),
          id: doc.id,
        }));

        const eventsData = hEventsData.concat(mEventsData);
        eventsData.sort((a, b) =>
          a.createdAt!.toDate() > b.createdAt!.toDate() ? -1 : 1
        );

        if (eventsData.length !== 0) {
          setNewEvents(eventsData.slice(0, 5));
        }
        setError(null);
      } catch (err) {
        setError(err);
      }
      setNewLoading(false);
    };

    load().catch((err) => {
      console.error(err);
    });
  }, [newEvents, setNewEvents]);

  return { newEvents, setNewEvents, newLoading, error };
};

export default useEventsNew;
