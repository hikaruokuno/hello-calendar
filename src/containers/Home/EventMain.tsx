import React, { FC, useContext } from "react";
import { EventTypeContext } from "contexts";

import useEventsApply from "hooks/use-events-apply";
import useEventsConfirm from "hooks/use-events-confirm";
import useEventsWeek from "hooks/use-events-week";
import EventMain from "components/Home/EventMain";
import usePerformances from "hooks/use-performances";

const EventMainContainer: FC = () => {
  const { weekEvents, weekLoading } = useEventsWeek();

  const { applyEvents, applyLoading } = useEventsApply(
    useContext(EventTypeContext).type
  );
  const { confirmEvents, confirmLoading } = useEventsConfirm(
    useContext(EventTypeContext).type
  );
  const loading =
    applyLoading && confirmLoading && weekLoading ? applyLoading : false;

  const { performances } = usePerformances(10);

  return (
    <EventMain
      weekEvents={weekEvents}
      applyEvents={applyEvents}
      confirmEvents={confirmEvents}
      performances={performances}
      loading={loading}
    />
  );
};

export default EventMainContainer;
