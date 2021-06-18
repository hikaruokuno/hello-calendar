import React, { FC } from "react";
import { EventDetail } from "services/hello-calendar/models/eventDetail";

const EventDetailText: FC<{ detail: EventDetail }> = ({ detail }) => (
  <>
    公演日: {detail.performanceDay}
    <br />
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
    {detail.openText}: {detail.openingTime}
    <br />
    {detail.showText}: {detail.showTime}
    <br />
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
);

export default EventDetailText;
