import { FirebaseContext } from "contexts";
import { useContext, useEffect, useRef, useState } from "react";
import { Event } from "services/hello-calendar/models/event";
// import { startOfDay } from 'date-fns';

const useEventsConfirm = (type: string) => {
  const [confirmEvents, setEvents] = useState<Event[]>([]);
  const [confirmLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const firebaseRef = useRef(useContext(FirebaseContext));

  useEffect(() => {
    const { db } = firebaseRef.current;
    if (!db) throw new Error("Firestore is not initialized");

    // 開始日 <= 現在日付 <= 終了日
    // const query = db
    //   .collection(type)
    //   .where('confirmStartDate', '<=', new Date())
    //   .where('confirmEndDate', '>=', new Date())
    //   .orderBy('confirmStartDate', 'desc');

    // TODO: サーバサイド側で、当落確認期間中フラグをもち、期間内であれば、1、期間外は0にする
    // もしくは、画面側で判断ロジックを作成する、（サーバサイドでデータ持ったほうが、処理は早い）
    const query = db
      .collection(type)
      .where("isConfirmEnded", "==", false)
      .where("confirmStartDate", "<=", new Date())
      .orderBy("confirmStartDate", "desc");
    // .orderBy('isConfirmEnded');

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
  }, [type]);

  return { confirmEvents, confirmLoading, error };
};

export default useEventsConfirm;
