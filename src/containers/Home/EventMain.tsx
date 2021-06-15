import React, { FC, useContext } from "react";
import { EventTypeContext } from "contexts";

import useEvents from "hooks/use-events";
import EventMain from "components/Home/EventMain";
import useEventsConfirm from "hooks/use-events-confirm";

const EventMainContainer: FC = () => {
  const { mainEvents, mainLoading } = useEvents(
    useContext(EventTypeContext).type
  );
  const { confirmEvents, confirmLoading } = useEventsConfirm(
    useContext(EventTypeContext).type
  );
  const loading = mainLoading && confirmLoading ? mainLoading : false;

  return (
    <EventMain
      mainEvents={mainEvents}
      confirmEvents={confirmEvents}
      loading={loading}
    />
  );
};

export default EventMainContainer;
