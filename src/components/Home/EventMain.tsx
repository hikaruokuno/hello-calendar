import React, { FC, useCallback, useContext } from "react";
import { EventsCountContext, EventTypeContext } from "contexts";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import EventList from "components/common/list/EventList";
import NewEventList from "components/common/list/NewEventList";
import ListCircular from "components/common/atoms/ListCircular";
import MoreLinkButton from "components/common/atoms/MoreLinkButton";
import { Event } from "services/hello-calendar/models/event";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import SoonPerformanceList from "components/common/list/SoonPerformanceList";
import Footer from "containers/common/Footer";
import MoreDisplayedButton from "components/common/atoms/MoreDisplayedButton";
import { BottomNavigation } from "@material-ui/core";
import { TwitterIcon, TwitterShareButton } from "react-share";
import { pushEventTracking } from "components/item-tools";

type EventProps = {
  newEvents: Event[];
  soonPerformances: EventDetail[];
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
    bottomNav: {
      justifyContent: "unset",
    },
  })
);

const EventMain: FC<EventProps> = React.memo(
  ({ newEvents, soonPerformances, mainEvents, mainMEvents, loading }) => {
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
              <NewEventList title="??????????????????" events={newEvents} />
            </>
            <>
              <EventList
                title="??????????????????"
                events={isHello ? mainEvents : mainMEvents}
                arrayCount={displayCount}
              />
              <MoreDisplayedButton onClick={displayMore} count={displayCount} />
            </>
            {soonPerformances.length === 0 ? (
              ""
            ) : (
              <>
                <SoonPerformanceList
                  title="???????????????????????????"
                  events={soonPerformances}
                />
                <MoreLinkButton
                  url="peformances"
                  text="?????????????????????????????????"
                />
              </>
            )}
            <Footer />
            <BottomNavigation className={classes.bottomNav}>
              <TwitterShareButton
                url={window.location.href}
                title="???????????? | ???????????????FC??????????????????????????? #????????????"
                onClick={() =>
                  pushEventTracking("tweet_click", window.location.href)
                }
              >
                <TwitterIcon size={40} round />
              </TwitterShareButton>
            </BottomNavigation>
          </>
        )}
      </>
    );
  }
);

export default EventMain;
