import React, { FC, useState } from "react";
import usePerformances from "hooks/use-all-performances";
import ListCircular from "components/common/atoms/ListCircular";
import EventDetailList from "components/common/list/EventDetalsList";
// import { useState } from "react";
import MoreButton from "components/common/atoms/MoreButton";
import { EventDetail } from "services/hello-calendar/models/eventDetail";

const PerformanceMainContainer: FC = () => {
  const [array, setArray] = useState<EventDetail[]>([]);
  const [lastDate, setLastDate] = useState(new Date());

  const { performances, performLoading, startAfter, end } = usePerformances(
    10,
    lastDate,
    array
  );

  const onClickMore = () => {
    setLastDate(startAfter);
    setArray(performances);
  };

  return (
    <>
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
