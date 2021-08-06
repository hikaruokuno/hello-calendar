import React, { FC, useContext } from "react";
import axios from "axios";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import {
  pushEventTracking,
  setEvents,
  setQueries,
  sleep,
} from "components/item-tools";

import { FirebaseContext } from "contexts";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import Popper from "@material-ui/core/Popper";
import Config from "apiGoogleconfig";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: "8px",
    },
    paper: {
      border: "1px solid",
      borderColor: theme.palette.grey[900],
      padding: theme.spacing(1),
      backgroundColor: theme.palette.grey[900],
      color: "white",
      fontSize: "13px",
    },
  })
);

type Event = {
  summary: string;
  location: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
};

type RestApiResponse = {
  access_token: string; // eslint-disable-line camelcase
  expires_in: number; // eslint-disable-line camelcase
  id_token: string; // eslint-disable-line camelcase
  refresh_token: string; // eslint-disable-line camelcase
  scope: string; // eslint-disable-line camelcase
};

const { clientId, clientSecret, apiKey } = Config;

const AddCalendarButton: FC<{ detail: EventDetail }> = ({ detail }) => {
  const classes = useStyles();
  const { isLoggedIn } = useContext(FirebaseContext);
  const events = isLoggedIn ? setEvents(detail) : setQueries(detail);
  const url = `https://calendar.google.com/calendar/u/0/r/eventedit?${events.toString()}`;

  const [anchorEl, setAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const target = event.currentTarget;

    if (gapi) {
      pushEventTracking("calendar_click", detail.performanceDay);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      gapi.client.setToken({
        access_token: localStorage.getItem("accessTokenKey")!,
      });

      await gapi.client.calendar.events
        .insert({
          calendarId: "primary",
          resource: events as Event,
          sendUpdates: "none",
        })
        .then(async () => {
          setAnchorEl(anchorEl ? null : target);
          await sleep(4000);
          setAnchorEl(null);
        })
        .catch(async () => {
          const params = new URLSearchParams();
          params.append("client_id", clientId);
          params.append("client_secret", clientSecret);
          params.append("grant_type", "refresh_token");
          params.append(
            "refresh_token",
            localStorage.getItem("refreshTokenKey")!
          );
          await axios
            .post(`https://oauth2.googleapis.com/token?key=${apiKey}`, params, {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            })
            .then(async (res) => {
              const data = res.data as RestApiResponse;
              localStorage.setItem("accessTokenKey", data.access_token);
              gapi.client.setToken({
                access_token: localStorage.getItem("accessTokenKey")!,
              });
              await gapi.client.calendar.events
                .insert({
                  calendarId: "primary",
                  resource: events as Event,
                  sendUpdates: "none",
                })
                .then(async () => {
                  setAnchorEl(anchorEl ? null : target);
                  await sleep(4000);
                  setAnchorEl(null);
                });
            })
            .catch((err) => {
              // 再ログインを促す または ログアウトする
              console.log(err);
            });
        });
    }

    return false;
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  return (
    <div className={classes.root}>
      {isLoggedIn ? (
        <>
          <Button
            aria-describedby={id}
            size="medium"
            variant="outlined"
            color="primary"
            onClick={(e) => handleClick(e)}
          >
            <CalendarTodayIcon fontSize="small" />
            &nbsp;Googleカレンダーに追加
          </Button>
          <Popper id={id} open={open} anchorEl={anchorEl}>
            <div className={classes.paper}>Googleカレンダーに追加しました</div>
          </Popper>
        </>
      ) : (
        <Button
          size="medium"
          variant="outlined"
          color="primary"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            pushEventTracking("calendar_click", detail.performanceDay)
          }
        >
          <CalendarTodayIcon fontSize="small" />
          &nbsp;Googleカレンダーに追加
        </Button>
      )}
    </div>
  );
};
export default AddCalendarButton;
