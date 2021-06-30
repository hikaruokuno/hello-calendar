import { FirebaseContext } from "contexts";
import { useContext, useEffect, useRef, useState } from "react";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
// import { startOfToday, startOfTomorrow } from 'date-fns';

// type SearchOptions = {
//   limit?: number;
//   today?: boolean;
//   lastDate?: Date;
// }

const usePerformances = (
  limit: number,
  lastDate?: Date,
  array?: EventDetail[]
) => {
  const [performances, setPerformances] = useState<EventDetail[]>([]);
  const [performLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [startAfter, setStartAfter] = useState(new Date());
  const [end, setEnd] = useState(false);

  const firebaseRef = useRef(useContext(FirebaseContext));

  useEffect(() => {
    const { db } = firebaseRef.current;
    if (!db) throw new Error("Firestore is not initialized");

    const collection =
      array!.length === 0
        ? db
            .collection("eventDetails")
            .orderBy("performanceDate", "asc")
            .startAt(lastDate)
            .limit(20)
        : db
            .collection("eventDetails")
            .orderBy("performanceDate", "asc")
            .startAfter(lastDate)
            .limit(limit);
    console.log(array!.length);

    const load = async () => {
      setLoading(true);

      try {
        const snapshot = await collection.get();
        let performancesData = snapshot.docs.map((doc) => ({
          ...(doc.data() as EventDetail),
          id: doc.id,
        }));
        setEnd(performancesData.length !== limit);

        performancesData = performancesData.filter(
          (element, index, self) =>
            self.findIndex(
              (e) =>
                e.title === element.title &&
                e.performanceDay === element.performanceDay &&
                e.openingTime === element.openingTime &&
                e.showTime === element.showTime
            ) === index
        );
        setStartAfter(performancesData.slice(-1)[0].performanceDate!.toDate());

        performancesData = array!.concat(performancesData);
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
  }, [limit, lastDate, array]);

  return { performances, performLoading, error, startAfter, end };
};

export default usePerformances;
