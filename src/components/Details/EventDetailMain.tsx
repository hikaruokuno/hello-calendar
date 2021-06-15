import React, { FC } from "react";

import ListCircular from "components/common/atoms/ListCircular";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import EventDetalsList from "components/common/list/EventDetalsList";
import { Event } from "services/hello-calendar/models/event";

type EventDetailProps = {
  event: Event;
  performer: string | null;
  eventDetails: EventDetail[];
  loading?: boolean;
};

const EventDetailMain: FC<EventDetailProps> = ({
  event,
  eventDetails,
  loading,
}) => (
  <>
    {loading ? (
      <ListCircular />
    ) : (
      <>
        <h2>{event.title}</h2>
        {event.performer ? <h3>出演者：{event.performer}</h3> : ""}
        {event.mc ? <h3>MC：{event.mc}</h3> : ""}
        <h4>申込期間：{event.applyPeriodStr}</h4>
        <h4>当選・落選確認期間：{event.confirmPeriodStr}</h4>
        <h4>入金締切日：{event.paymentDateStr}</h4>
        <EventDetalsList title={event.title} eventDetails={eventDetails} />
      </>
    )}
  </>
);

export default EventDetailMain;
