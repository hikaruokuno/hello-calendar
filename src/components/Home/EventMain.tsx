import React, { FC } from "react";

import Tabs from "components/common/tabs/Tabs";
import EventList from "components/common/list/EventList";
import ListCircular from "components/common/atoms/ListCircular";
import { Event } from "services/hello-calendar/models/event";

type EventProps = {
  applyEvents: Event[];
  confirmEvents: Event[];
  loading?: boolean;
};

const EventMain: FC<EventProps> = ({ applyEvents, confirmEvents, loading }) => (
  <>
    <Tabs />
    {loading ? (
      <ListCircular />
    ) : (
      <>
        <EventList title="当落確認期間中のイベント" events={confirmEvents} />
        <EventList title="申込期間中のイベント" events={applyEvents} />
      </>
    )}
  </>
);

export default EventMain;
