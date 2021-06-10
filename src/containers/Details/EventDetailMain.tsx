import React, { FC } from "react";
import EventDetailsMain from "components/Details/EventDetailMain";
import { useParams } from "react-router";
import useEventDetails from "hooks/use-event-details";

const EventDetailsMainContainer: FC = () => {
  const { eventId } = useParams();
  const { title, performer, eventDetails, loading } = useEventDetails(eventId);

  return (
    <EventDetailsMain
      title={title}
      performer={performer}
      eventDetails={eventDetails}
      loading={loading}
    />
  );
};

export default EventDetailsMainContainer;
