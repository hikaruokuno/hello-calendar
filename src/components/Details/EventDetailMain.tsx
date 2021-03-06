import React, { FC, useEffect, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import ListCircular from "components/common/atoms/ListCircular";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import EventDetalsList from "components/common/list/EventDetalsList";
import { Event } from "services/hello-calendar/models/event";
import {
  Typography,
  Link,
  Theme,
  BottomNavigation,
  Button,
} from "@material-ui/core";
import { Helmet } from "react-helmet";
import { titleName } from "constants/constants";
import { TwitterIcon, TwitterShareButton } from "react-share";
import Footer from "containers/common/Footer";
import { pushEventTracking } from "components/item-tools";

type EventDetailProps = {
  event: Event;
  performer: string | null;
  eventDetails: EventDetail[];
  loading?: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
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
    circular: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(8),
    },
    bottomNav: {
      position: "fixed",
      bottom: 0,
      width: "100%",
      backgroundColor: "transparent",
      justifyContent: "unset",
    },
  })
);

const EventDetailMain: FC<EventDetailProps> = ({
  event,
  eventDetails,
  loading,
}) => {
  const classes = useStyles();
  const type = event.type === "hello" ? "helloproject" : "m-line";
  const applyUrl = `https://www.up-fc.jp/${type}/fan_AllEventTour_List.php`;
  const confirmUrl = `https://www.up-fc.jp/${type}/mypage02.php`;
  const isConfirmStarted = event.confirmStartDate!.toDate() <= new Date();
  const [textShow, setTextShow] = useState(true);
  const [buttonShow, setButtonShow] = useState(false);

  useEffect(() => {
    if (event.performer && event.performer.length > 38) {
      setTextShow(false);
      setButtonShow(true);
    }
  }, [event.performer, setTextShow, setButtonShow]);

  return (
    <>
      <Helmet>
        <title>
          {event.title} | {titleName.main}
        </title>
      </Helmet>
      {loading ? (
        <div className={classes.circular}>
          <ListCircular />
        </div>
      ) : (
        <div className={classes.root}>
          <Typography
            variant="subtitle1"
            color="inherit"
            className={classes.title}
          >
            <strong>{event.title}</strong>
          </Typography>
          {eventDetails.length === 0 ? (
            <Typography variant="subtitle2">
              すべての公演が終了しました。
            </Typography>
          ) : (
            <>
              <div className={classes.body}>
                {event.performer ? (
                  <Typography variant="body2" color="inherit">
                    <strong>出演</strong>
                    {buttonShow && (
                      <Button
                        type="button"
                        size="small"
                        color="primary"
                        onClick={() => setTextShow((prev) => !prev)}
                      >
                        {textShow ? "非表示にする" : "表示する"}
                      </Button>
                    )}
                    {textShow && <br />}
                    {textShow &&
                      event.performer.split("改行").map((item, index) => {
                        if (index === 0 && !item) return "";
                        const key = `P${index}`;

                        return (
                          <React.Fragment key={key}>
                            {item}
                            <br />
                          </React.Fragment>
                        );
                      })}
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
                    <Link
                      href={applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {" "}
                      [ファンクラブで申し込む]
                    </Link>
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
                        <Link
                          href={confirmUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {" "}
                          [ファンクラブで確認する]
                        </Link>
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
                {event.fee ? (
                  <Typography variant="body2" color="inherit">
                    <strong>料金</strong>
                    <br />
                    {event.fee}
                  </Typography>
                ) : (
                  ""
                )}
              </div>
              <EventDetalsList eventDetails={eventDetails} />
              <BottomNavigation className={classes.bottomNav}>
                <TwitterShareButton
                  url={window.location.href}
                  title={`${event.title} #ハロカレ`}
                  onClick={() =>
                    pushEventTracking("tweet_click", window.location.href)
                  }
                >
                  <TwitterIcon size={40} round />
                </TwitterShareButton>
              </BottomNavigation>
            </>
          )}
          <Footer />
        </div>
      )}
    </>
  );
};

export default EventDetailMain;
