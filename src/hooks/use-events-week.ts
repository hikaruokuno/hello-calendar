/* eslint-disable no-plusplus */
import { FirebaseContext, EventsContext } from "contexts";
import { useContext, useEffect, useRef, useState } from "react";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import { isAfterThreeDays } from "components/item-tools";
// import { startOfDay } from 'date-fns';

const useEventsWeek = () => {
  // const [weekEvents, setWeekEvents] = useState<EventDetail[]>([]);
  const { weekEvents, setWeekEvents } = useContext(EventsContext);
  const [weekLoading, setLoading] = useState(false);

  const [error, setError] = useState<Error | null>(null);

  const firebaseRef = useRef(useContext(FirebaseContext));

  useEffect(() => {
    if (weekEvents.length !== 0) {
      return;
    }
    console.log(weekEvents);
    const { db } = firebaseRef.current;
    if (!db) throw new Error("Firestore is not initialized");

    const query = db
      .collection("eventDetails")
      .where("performanceDate", ">=", new Date())
      .orderBy("performanceDate", "asc");
    // .orderBy('isWeekEnded');

    const load = async () => {
      setLoading(true);

      try {
        const snap = await query.get();

        let eventsData = [];
        for (let i = 0; i < snap.docs.length; i++) {
          const data = snap.docs[i].data() as EventDetail;

          if (isAfterThreeDays(data.performanceDate!.toDate())) {
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
          setWeekEvents(eventsData);
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
  }, [weekEvents, setWeekEvents]);

  return { weekEvents, weekLoading, error };
};

export default useEventsWeek;
