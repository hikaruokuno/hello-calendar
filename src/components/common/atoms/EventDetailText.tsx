import React, { FC } from "react";
import { EventDetail } from "services/hello-calendar/models/eventDetail";

const EventDetailText: FC<{ detail: EventDetail }> = ({ detail }) => (
  <>
    公演日: {detail.performanceDay}
    <br />
    会場: {detail.venue}
    <br />
    開場: {detail.openingTime}
    <br />
    開演: {detail.showTime}
    <br />
  </>
);

export default EventDetailText;
