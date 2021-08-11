import React, { FC, useContext } from "react";
import { EventTypeContext } from "contexts";

import useEventsWeek from "hooks/use-events-week";
import EventMain from "components/Home/EventMain";
import useEvents from "hooks/use-events";
import useEventsNew from "hooks/use-events-new";

const EventMainContainer: FC = () => {
  const { newEvents, newLoading } = useEventsNew();
  const { weekEvents, weekLoading } = useEventsWeek();

  const { mainEvents, mainMEvents, mainLoading } = useEvents(
    useContext(EventTypeContext).type
  );
  const loading =
    mainLoading && weekLoading && newLoading ? mainLoading : false;

  return (
    <>
      <EventMain
        newEvents={newEvents}
        weekEvents={weekEvents}
        mainEvents={mainEvents}
        mainMEvents={mainMEvents}
        loading={loading}
      />
    </>
  );
};

export default EventMainContainer;
