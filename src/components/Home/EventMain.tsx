import React, { FC, useContext, useCallback } from "react";
import { EventsCountContext, EventTypeContext } from "contexts";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { gapi } from "gapi-script";

import Tabs from "components/common/tabs/Tabs";
import EventList from "components/common/list/EventList";
import ListCircular from "components/common/atoms/ListCircular";
import MoreLinkButton from "components/common/atoms/MoreLinkButton";
import { Event } from "services/hello-calendar/models/event";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import WeekEventList from "components/common/list/WeekEventList";
import EventDetailList from "components/common/list/EventDetalsList";
import { Typography } from "@material-ui/core";
import MoreButton from "components/common/atoms/MoreButton";

type EventProps = {
  weekEvents: EventDetail[];
  applyEvents: Event[];
  applyMEvents: Event[];
  confirmEvents: Event[];
  confirmMEvents: Event[];
  performances: EventDetail[];
  loading?: boolean;
};

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      fontSize: "medium",
    },
  })
);

const EventMain: FC<EventProps> = React.memo(
  ({
    weekEvents,
    applyEvents,
    applyMEvents,
    confirmEvents,
    confirmMEvents,
    performances,
    loading,
  }) => {
    const classes = useStyles();
    const { type } = useContext(EventTypeContext);
    const { applyCount, setApplyCount } = useContext(EventsCountContext);
    const { confirmCount, setConfirmCount } = useContext(EventsCountContext);
    const isEvents = type === "hEvents" || type === "mEvents";
    const isHello = type === "hEvents";
    console.log(applyEvents);

    const applyMore = useCallback(() => {
      setApplyCount(applyCount + 5);
    }, [applyCount, setApplyCount]);

    const confirmMore = useCallback(() => {
      setConfirmCount(confirmCount + 5);
    }, [confirmCount, setConfirmCount]);

    const onclickButton = async () => {
      console.log("sign", gapi.auth2.getAuthInstance().isSignedIn.get());
      const event = {
        summary: "ワンタッチでイベント登録！テスト！！！！",
        location: "中野サンプラザ",
        description: "イベントだよーん",
        start: {
          dateTime: "2021-07-15T09:00:00-07:00",
          timeZone: "Asia/Tokyo",
        },
        end: {
          dateTime: "2021-07-15T17:00:00-07:00",
          timeZone: "Asia/Tokyo",
        },
      };

      if (gapi) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        await gapi.client.calendar.events.insert({
          calendarId: "primary",
          resource: event,
          sendUpdates: "none",
        });
      }
      console.log("Error: this.gapi not loaded");

      return false;
    };

    const handleAuthSignOutClick = async () => {
      if (gapi) {
        await gapi.auth2.getAuthInstance().signOut();
      } else {
        console.log("Error: this.gapi not loaded");
      }
    };

    return (
      <>
        <button type="button" onClick={() => onclickButton()}>
          Button
        </button>
        <button type="button" onClick={() => handleAuthSignOutClick()}>
          サインアウト
        </button>
        {loading ? (
          <ListCircular />
        ) : (
          <>
            {weekEvents.length === 0 ? (
              ""
            ) : (
              <WeekEventList title="もうすぐ始まる公演" events={weekEvents} />
            )}
            <Tabs />
            {isEvents ? (
              <>
                <EventList
                  title="申込期間中のイベント"
                  events={isHello ? applyEvents : applyMEvents}
                  arrayCount={applyCount}
                />
                {(isHello && applyEvents.length <= applyCount) ||
                (!isHello && applyMEvents.length <= applyCount) ? (
                  ""
                ) : (
                  <MoreButton onClick={applyMore} />
                )}
                <EventList
                  title="当落確認期間中のイベント"
                  events={isHello ? confirmEvents : confirmMEvents}
                  arrayCount={confirmCount}
                />
                {(isHello && confirmEvents.length <= confirmCount) ||
                (!isHello && confirmMEvents.length <= confirmCount) ? (
                  ""
                ) : (
                  <MoreButton onClick={confirmMore} />
                )}
              </>
            ) : (
              <>
                <br />
                <Typography color="inherit" className={classes.title}>
                  <strong>本日以降の公演</strong>
                </Typography>
                <EventDetailList eventDetails={performances} />
                <MoreLinkButton url="peformances" />
              </>
            )}
          </>
        )}
      </>
    );
  }
);

export default EventMain;
