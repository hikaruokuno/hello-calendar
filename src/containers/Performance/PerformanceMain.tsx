import React, { FC } from "react";
import usePerformances from "hooks/use-performances";
import ListCircular from "components/common/atoms/ListCircular";
import EventDetailList from "components/common/list/EventDetalsList";

const PerformanceMainContainer: FC = () => {
  const { performances, performLoading } = usePerformances(30);

  return performLoading ? (
    <ListCircular />
  ) : (
    <EventDetailList eventDetails={performances} />
  );
};

export default PerformanceMainContainer;
