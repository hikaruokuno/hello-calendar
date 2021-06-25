/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useContext, useEffect, useRef, useState } from "react";

import firebase from "firebase/app";
import { FirebaseContext } from "contexts";
import { tokenize } from "utils/text-processor";
import { EventDetail } from "services/hello-calendar/models/eventDetail";

type searchOptions = {
  limit?: number;
};
const defaultOptions: searchOptions = {
  limit: 30,
};

const buildQuery = (
  collection: firebase.firestore.CollectionReference,
  q: string,
  options: searchOptions
) => {
  let query = collection.limit(options.limit!);

  tokenize(q).forEach((token) => {
    query = query.where(`tokenMap.${token}`, "==", true);
  });

  return query;
};

const useEventDetailsSearch = (q: string, options?: searchOptions) => {
  const [performances, setPerformances] = useState<EventDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const firebaseRef = useRef(useContext(FirebaseContext));
  const optionsRef = useRef({ ...defaultOptions, ...options });

  useEffect(() => {
    const { db } = firebaseRef.current;
    if (!db) throw new Error("Firestore is not initialized");
    const collection = db.collection("eventDetails");
    const query = buildQuery(collection, q, optionsRef.current);

    const load = async () => {
      if (q.length >= 1) {
        setLoading(true);
        try {
          const snap = await query.get();

          const performancesData = snap.docs.map((doc) => ({
            ...(doc.data() as EventDetail),
            id: doc.id,
          }));
          setPerformances(performancesData);
          setError(null);
        } catch (err) {
          setError(err);
        }
        setLoading(false);
      } else {
        setPerformances([]);
      }
    };

    load().catch((err) => {
      console.error(err);
    });
  }, [q]);

  return { performances, loading, error };
};

export default useEventDetailsSearch;
