import React, { FC, useContext } from "react";
import { EventTypeContext } from "contexts";

import useEvents from "hooks/use-events";
import EventMain from "components/Home/EventMain";

const EventMainContainer: FC = () => {
  const { events, loading } = useEvents(useContext(EventTypeContext).type);

  return <EventMain events={events} loading={loading} />;
};

export default EventMainContainer;
