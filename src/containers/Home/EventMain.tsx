import React, { FC, useContext } from "react";
import { EventTypeContext } from "contexts";

import useEventsApply from "hooks/use-events-apply";
import useEventsConfirm from "hooks/use-events-confirm";
import useEventsWeek from "hooks/use-events-week";
import EventMain from "components/Home/EventMain";

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

  return (
    <EventMain
      weekEvents={weekEvents}
      applyEvents={applyEvents}
      confirmEvents={confirmEvents}
      loading={loading}
    />
  );
};

export default EventMainContainer;
