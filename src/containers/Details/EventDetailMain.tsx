import React, { FC } from "react";
import EventDetailsMain from "components/Details/EventDetailMain";
import { useParams } from "react-router";
import useEventDetails from "hooks/use-event-details";

const EventDetailsMainContainer: FC = () => {
  const { type, eventId } = useParams();
  const { event, eventDetails, loading } = useEventDetails(type, eventId);

  return event ? (
    <EventDetailsMain
      event={event}
      performer={event ? event.performer : ""}
      eventDetails={eventDetails}
      loading={loading}
    />
  ) : (
    <></>
  );
};

export default EventDetailsMainContainer;
