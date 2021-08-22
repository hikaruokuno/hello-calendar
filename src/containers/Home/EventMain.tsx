import React, { FC, useContext } from "react";
import { EventTypeContext } from "contexts";

import useEventsWeek from "hooks/use-performances-soon";
import EventMain from "components/Home/EventMain";
import useEvents from "hooks/use-events";
import useEventsNew from "hooks/use-events-new";

const EventMainContainer: FC = () => {
  const { newEvents, newLoading } = useEventsNew();
  const { soonPerformances, soonLoading } = useEventsWeek();

  const { mainEvents, mainMEvents, mainLoading } = useEvents(
    useContext(EventTypeContext).type
  );
  const loading =
    mainLoading && soonLoading && newLoading ? mainLoading : false;

  return (
    <>
      <EventMain
        newEvents={newEvents}
        soonPerformances={soonPerformances}
        mainEvents={mainEvents}
        mainMEvents={mainMEvents}
        loading={loading}
      />
    </>
  );
};

export default EventMainContainer;
