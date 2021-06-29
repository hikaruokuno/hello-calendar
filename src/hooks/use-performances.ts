import { FirebaseContext } from "contexts";
import { useContext, useEffect, useRef, useState } from "react";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import { startOfTomorrow } from "date-fns";

const usePerformances = (limit: number) => {
  const [performances, setPerformances] = useState<EventDetail[]>([]);
  const [performLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const firebaseRef = useRef(useContext(FirebaseContext));

  useEffect(() => {
    const { db } = firebaseRef.current;
    if (!db) throw new Error("Firestore is not initialized");

    const collection = db
      .collection("eventDetails")
      .where("performanceDate", ">=", startOfTomorrow())
      .orderBy("performanceDate", "asc")
      .limit(limit);

    const load = async () => {
      setLoading(true);

      try {
        const snapshot = await collection.get();
        let performancesData = snapshot.docs.map((doc) => ({
          ...(doc.data() as EventDetail),
          id: doc.id,
        }));

        performancesData = performancesData.filter(
          (element, index, self) =>
            self.findIndex(
              (e) =>
                e.title === element.title &&
                e.performanceDay === element.performanceDay &&
                e.showTime === element.showTime
            ) === index
        );

        setPerformances(performancesData);
        setError(null);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };

    load().catch((err) => {
      console.error(err);
    });
  }, [limit]);

  return { performances, performLoading, error };
};

export default usePerformances;
