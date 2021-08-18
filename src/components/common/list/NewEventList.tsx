import React, { FC } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import NewEventName from "components/common/atoms/NewEventName";
import { Event } from "services/hello-calendar/models/event";
import Typography from "@material-ui/core/Typography";
import { FiberNew } from "@material-ui/icons";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      fontSize: "medium",
    },
    divider: {
      backgroundColor: "black",
    },
  })
);

const NewEventList: FC<{
  title: string;
  events: Event[];
  arrayCount?: number;
}> = React.memo(({ title, events }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <br />
      <Grid container direction="row" alignItems="center">
        <Grid item>
          <FiberNew fontSize="small" color="inherit" />
        </Grid>
        <Typography color="inherit" className={classes.title}>
          &nbsp;<strong>{title}</strong>
        </Typography>
      </Grid>
      <Divider className={classes.divider} />
      {events.length === 0 ? (
        <>
          <br />
          <Typography variant="subtitle2">
            &nbsp;&nbsp;過去3日以内に追加されたイベントはありません。
          </Typography>
        </>
      ) : (
        <List component="nav" aria-label="main mailbox folders">
          {events.map((event) => (
            <NewEventName event={event} />
          ))}
        </List>
      )}
    </div>
  );
});

export default NewEventList;
