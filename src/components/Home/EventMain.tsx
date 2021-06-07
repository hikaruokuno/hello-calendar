import React, { FC } from "react";

import Tabs from "components/common/tabs/Tabs";
import EventList from "components/common/list/EventList";
import ListCircular from "components/common/atoms/ListCircular";
import { Event } from "services/hello-calendar/models/event";

type EventProps = { events: Event[]; loading?: boolean };

const EventMain: FC<EventProps> = ({ events, loading }) => (
  <>
    <h2>イベント一覧</h2>
    <Tabs />
    {loading ? <ListCircular /> : <EventList events={events} />}
  </>
);

export default EventMain;
