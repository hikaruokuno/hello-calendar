/* eslint-disable no-plusplus */
import { FirebaseContext, EventsContext } from "contexts";
import { useContext, useEffect, useRef, useState } from "react";
import { EventDetail } from "services/hello-calendar/models/eventDetail";

const usePerformancesSoon = () => {
  // const [soonPerformances, setSoonPerformances] = useState<EventDetail[]>([]);
  const { soonPerformances, setSoonPerformances } = useContext(EventsContext);
  const [soonLoading, setLoading] = useState(false);

  const [error, setError] = useState<Error | null>(null);

  const firebaseRef = useRef(useContext(FirebaseContext));

  useEffect(() => {
    if (soonPerformances.length !== 0) {
      return;
    }
    const { db } = firebaseRef.current;
    if (!db) throw new Error("Firestore is not initialized");

    const query = db
      .collection("eventDetails")
      .where("performanceDate", ">=", new Date())
      .orderBy("performanceDate", "asc")
      .limit(10);

    const load = async () => {
      setLoading(true);

      try {
        const snap = await query.get();

        let eventsData = [];
        for (let i = 0; i < snap.docs.length; i++) {
          if (eventsData.length > 5) break;
          const data = snap.docs[i].data() as EventDetail;

          if (
            (data.openText.includes("開演") &&
              !data.showText.includes("開演")) ||
            (!data.openText.includes("開演") &&
              data.showText.includes("開演")) ||
            (!data.openText.includes("開演") && !data.showText.includes("開演"))
          ) {
            eventsData.push(data);
          }
        }

        eventsData = eventsData.filter(
          (element, index, self) =>
            self.findIndex(
              (e) =>
                e.title === element.title &&
                e.performanceDay === element.performanceDay &&
                e.openingTime === element.openingTime &&
                e.showTime === element.showTime
            ) === index
        );

        if (eventsData.length !== 0) {
          setSoonPerformances(eventsData);
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
  }, [soonPerformances, setSoonPerformances]);

  return { soonPerformances, soonLoading, error };
};

export default usePerformancesSoon;
