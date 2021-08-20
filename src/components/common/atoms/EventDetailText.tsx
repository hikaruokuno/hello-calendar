import React, { FC } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { ListItemText, ListItemIcon, Typography } from "@material-ui/core";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import AddCalendarButton from "components/Details/AddCalendarButton";
import { useLocation } from "react-router";
import DividerWithText from "./DividerWithText";

const useStyles = makeStyles(() =>
  createStyles({
    primary: {
      color: "blue",
      fontWeight: "bold",
      fontSize: "large",
    },
    secondary: {
      color: "black",
      fontSize: "inherit",
    },
    listItem: {
      paddingTop: "0px",
      paddingBottom: "0px",
    },
  })
);

const EventDetailText: FC<{
  detail: EventDetail;
  count: number;
  display: boolean;
}> = ({ detail, count, display }) => {
  const classes = useStyles();
  const path = useLocation().pathname;
  const isNotDetail =
    path === "/" || path === "/peformances" || path === "/search";

  return (
    <>
      <ListItemText
        primary={
          isNotDetail ? (
            <>
              <Typography variant="subtitle1" color="textPrimary">
                <strong>{detail.title}</strong>
              </Typography>
              {detail.performanceDay}
            </>
          ) : (
            display && detail.performanceDay
          )
        }
        secondary={
          <>
            {display && (
              <>
                会場: {detail.venue}
                <br />
                {detail.performer ? (
                  <>
                    {detail.performer}
                    <br />
                  </>
                ) : (
                  ""
                )}
              </>
            )}
            <DividerWithText text={`0${count}`} />
            {detail.openText}: {detail.openingTime}
            <br />
            {detail.showText ? (
              <>
                {detail.showText}: {detail.showTime}
                <br />
              </>
            ) : (
              ""
            )}
            {!detail.otherText && !detail.otherDetail ? (
              ""
            ) : (
              <>
                {detail.otherText && detail.otherDetail ? (
                  <>
                    {detail.otherText}: {detail.otherDetail}
                    <br />
                  </>
                ) : (
                  <>
                    {detail.otherText}
                    <br />
                  </>
                )}
              </>
            )}
            {detail.openText.includes("開演") &&
            detail.showText.includes("開演") ? (
              ""
            ) : (
              <ListItemIcon>
                <AddCalendarButton detail={detail} />
              </ListItemIcon>
            )}
          </>
        }
        classes={{ primary: classes.primary, secondary: classes.secondary }}
      />
    </>
  );
};

export default EventDetailText;
