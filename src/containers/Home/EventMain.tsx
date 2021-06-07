import React, { FC } from "react";

import useEvents from "hooks/use-events";
import EventMain from "components/Home/EventMain";

const EventMainContainer: FC = () => {
  const { events, loading } = useEvents();

  return <EventMain events={events} loading={loading} />;
};

export default EventMainContainer;
