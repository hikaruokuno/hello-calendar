import React, { FC, useContext } from "react";
import { EventTypeContext } from "contexts";

import useEventsWeek from "hooks/use-events-week";
import EventMain from "components/Home/EventMain";
import useEvents from "hooks/use-events";

const EventMainContainer: FC = () => {
  const { weekEvents, weekLoading } = useEventsWeek();

  const { mainEvents, mainMEvents, mainLoading } = useEvents(
    useContext(EventTypeContext).type
  );
  const loading = mainLoading && weekLoading ? mainLoading : false;

  return (
    <>
      <EventMain
        weekEvents={weekEvents}
        mainEvents={mainEvents}
        mainMEvents={mainMEvents}
        loading={loading}
      />
    </>
  );
};

export default EventMainContainer;
