import React, { FC } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import ListCircular from "components/common/atoms/ListCircular";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import EventDetalsList from "components/common/list/EventDetalsList";
import { Event } from "services/hello-calendar/models/event";
import { Typography, Link } from "@material-ui/core";

type EventDetailProps = {
  event: Event;
  performer: string | null;
  eventDetails: EventDetail[];
  loading?: boolean;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      margin: "8px",
    },
    title: {
      marginBottom: "8px",
    },
    body: {
      paddingLeft: "16px",
      fontSize: "smaller",
    },
  })
);

const EventDetailMain: FC<EventDetailProps> = ({
  event,
  eventDetails,
  loading,
}) => {
  const classes = useStyles();
  const applyUrl =
    "https://www.up-fc.jp/helloproject/fan_AllEventTour_List.php";
  const confirmUrl = "https://www.up-fc.jp/helloproject/mypage02.php";
  const isConfirmStarted = event.confirmStartDate!.toDate() <= new Date();

  return (
    <>
      {loading ? (
        <ListCircular />
      ) : (
        <div className={classes.root}>
          <Typography
            variant="subtitle1"
            color="inherit"
            className={classes.title}
          >
            <strong>{event.title}</strong>
          </Typography>
          <div className={classes.body}>
            {event.performer ? (
              <Typography variant="body2" color="inherit">
                <strong>出演</strong>
                <br />
                {event.performer}
              </Typography>
            ) : (
              ""
            )}
            {event.mc ? (
              <Typography variant="body2" color="inherit">
                <strong>MC</strong>
                <br />
                {event.mc}
              </Typography>
            ) : (
              ""
            )}
            {event.isApplyEnded ? (
              ""
            ) : (
              <Typography variant="body2" color="inherit">
                <strong>申込期間</strong>
                <Link href={applyUrl}> [申し込む]</Link>
                <br />
                {event.applyPeriodStr}
              </Typography>
            )}
            {event.isConfirmEnded ? (
              ""
            ) : (
              <>
                <Typography variant="body2" color="inherit">
                  <strong>当落確認期間</strong>
                  {isConfirmStarted ? (
                    <Link href={confirmUrl}> [確認する]</Link>
                  ) : (
                    ""
                  )}
                  <br />
                  {event.confirmPeriodStr}
                </Typography>
                <Typography variant="body2" color="inherit">
                  <strong>入金締切日</strong>
                  <br />
                  {event.paymentDateStr}
                </Typography>
              </>
            )}
          </div>
          <EventDetalsList title={event.title} eventDetails={eventDetails} />
        </div>
      )}
    </>
  );
};

export default EventDetailMain;
