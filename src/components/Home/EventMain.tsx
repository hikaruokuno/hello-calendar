import React, { FC, useCallback, useContext } from "react";
import { EventsCountContext, EventTypeContext } from "contexts";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import EventList from "components/common/list/EventList";
import NewEventList from "components/common/list/NewEventList";
import ListCircular from "components/common/atoms/ListCircular";
import MoreLinkButton from "components/common/atoms/MoreLinkButton";
import { Event } from "services/hello-calendar/models/event";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import WeekEventList from "components/common/list/WeekEventList";
import Footer from "containers/common/Footer";
import MoreDisplayedButton from "components/common/atoms/MoreDisplayedButton";

type EventProps = {
  newEvents: Event[];
  weekEvents: EventDetail[];
  mainEvents: Event[];
  mainMEvents: Event[];
  loading?: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontSize: "medium",
    },
    circular: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(8),
    },
  })
);

const EventMain: FC<EventProps> = React.memo(
  ({ newEvents, weekEvents, mainEvents, mainMEvents, loading }) => {
    const classes = useStyles();
    const { type } = useContext(EventTypeContext);
    const { displayCount, setDisplayCount } = useContext(EventsCountContext);
    const isHello = type === "hEvents";

    const displayMore = useCallback(() => {
      const initCount = 5;
      if (displayCount === initCount) {
        setDisplayCount(displayCount + 25);
      } else {
        setDisplayCount(initCount);
      }
    }, [displayCount, setDisplayCount]);

    return (
      <>
        {loading ? (
          <div className={classes.circular}>
            <ListCircular />
          </div>
        ) : (
          <>
            <>
              <NewEventList title="新着イベント" events={newEvents} />
            </>
            <>
              <EventList
                title="イベント情報"
                events={isHello ? mainEvents : mainMEvents}
                arrayCount={displayCount}
              />
              <MoreDisplayedButton onClick={displayMore} count={displayCount} />
            </>
            {weekEvents.length === 0 ? (
              ""
            ) : (
              <>
                <WeekEventList title="もうすぐ始まる公演" events={weekEvents} />
                <MoreLinkButton
                  url="peformances"
                  text="公演スケジュールを見る"
                />
              </>
            )}
            <Footer />
          </>
        )}
      </>
    );
  }
);

export default EventMain;
