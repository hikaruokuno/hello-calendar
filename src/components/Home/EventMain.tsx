import React, { FC } from "react";

import Tabs from "components/common/tabs/Tabs";
import EventList from "components/common/list/EventList";
import ListCircular from "components/common/atoms/ListCircular";
import { Event } from "services/hello-calendar/models/event";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import WeekEventList from "components/common/list/WeekEventList";

type EventProps = {
  weekEvents: EventDetail[];
  applyEvents: Event[];
  confirmEvents: Event[];
  loading?: boolean;
};

const EventMain: FC<EventProps> = ({
  weekEvents,
  applyEvents,
  confirmEvents,
  loading,
}) => (
  <>
    {loading ? (
      <ListCircular />
    ) : (
      <>
        <WeekEventList title="もうすぐ始まる公演" events={weekEvents} />
        <Tabs />
        <EventList title="当落確認期間中のイベント" events={confirmEvents} />
        <EventList title="申込期間中のイベント" events={applyEvents} />
      </>
    )}
  </>
);

export default EventMain;
