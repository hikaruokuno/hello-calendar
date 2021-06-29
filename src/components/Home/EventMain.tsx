import React, { FC, useContext } from "react";
import { EventTypeContext } from "contexts";

import Tabs from "components/common/tabs/Tabs";
import EventList from "components/common/list/EventList";
import ListCircular from "components/common/atoms/ListCircular";
import MoreLinkButton from "components/common/atoms/MoreLinkButton";
import { Event } from "services/hello-calendar/models/event";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import WeekEventList from "components/common/list/WeekEventList";
import EventDetailList from "components/common/list/EventDetalsList";
import { Typography } from "@material-ui/core";

type EventProps = {
  weekEvents: EventDetail[];
  applyEvents: Event[];
  confirmEvents: Event[];
  performances: EventDetail[];
  loading?: boolean;
};

const EventMain: FC<EventProps> = ({
  weekEvents,
  applyEvents,
  confirmEvents,
  performances,
  loading,
}) => {
  const { type } = useContext(EventTypeContext);
  const isEvents = type === "hEvents" || type === "mEvents";

  return (
    <>
      {loading ? (
        <ListCircular />
      ) : (
        <>
          <WeekEventList title="もうすぐ始まる公演" events={weekEvents} />
          <Tabs />
          {isEvents ? (
            <>
              <EventList title="申込期間中のイベント" events={applyEvents} />
              <EventList
                title="当落確認期間中のイベント"
                events={confirmEvents}
              />
            </>
          ) : (
            <>
              <br />
              <Typography variant="h6" color="inherit">
                <strong>明日以降の公演</strong>
              </Typography>
              <EventDetailList eventDetails={performances} />
              <MoreLinkButton url="peformances" />
            </>
          )}
        </>
      )}
    </>
  );
};

export default EventMain;
