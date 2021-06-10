import React, { FC } from "react";

import ListCircular from "components/common/atoms/ListCircular";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import EventDetalsList from "components/common/list/EventDetalsList";

type EventDetailProps = {
  title: string;
  performer: string | null;
  eventDetails: EventDetail[];
  loading?: boolean;
};

const EventDetailMain: FC<EventDetailProps> = ({
  title,
  performer,
  eventDetails,
  loading,
}) => (
  <>
    <h2>{title}</h2>
    {performer ? <h3>出演者: {performer}</h3> : ""}
    {loading ? (
      <ListCircular />
    ) : (
      <EventDetalsList eventDetails={eventDetails} />
    )}
  </>
);

export default EventDetailMain;
