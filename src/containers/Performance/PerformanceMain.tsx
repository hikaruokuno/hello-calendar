import React, { FC, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import usePerformances from "hooks/use-performances";
import ListCircular from "components/common/atoms/ListCircular";
import EventDetailList from "components/common/list/EventDetalsList";
import MoreButton from "components/common/atoms/MoreButton";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import { Typography } from "@material-ui/core";
import { Helmet } from "react-helmet";

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      fontSize: "medium",
    },
  })
);

const PerformanceMainContainer: FC = () => {
  const classes = useStyles();
  const [array, setArray] = useState<EventDetail[]>([]);
  const [lastDate, setLastDate] = useState(new Date());

  const { performances, performLoading, startAfter, end } = usePerformances(
    15,
    lastDate,
    array
  );

  const onClickMore = () => {
    setLastDate(startAfter);
    setArray(performances);
  };

  return (
    <>
      <Helmet>
        <title>公演一覧 | ハロカレ</title>
      </Helmet>
      <br />
      <Typography color="inherit" className={classes.title}>
        <strong>公演一覧</strong>
      </Typography>
      <EventDetailList eventDetails={performances} />
      {performLoading ? (
        <ListCircular />
      ) : (
        <MoreButton onClick={onClickMore} end={end} />
      )}
    </>
  );
};

export default PerformanceMainContainer;
