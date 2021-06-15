import React, { FC } from "react";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import LinkButton from "components/common/atoms/LinkButton";
import getDates from "components/item-tools";

const AddCalendarButton: FC<{ title: string; detail: EventDetail }> = ({
  title,
  detail,
}) => {
  const queries = new URLSearchParams();
  queries.set("action", "TEMPLATE");
  if (title.substring(0, 1) === "【") {
    queries.set(
      "text",
      `『${title.substring(title.indexOf("】") + 1)}』公演日`
    );
  } else {
    queries.set("text", `『${title}』公演日`);
  }
  queries.set("dates", getDates(detail.performanceDay, detail.showTime));
  queries.set("ctz", "Asia/Tokyo");

  if (detail.performer) {
    queries.set(
      "details",
      `出演者： ${detail.performer} \n会場： ${detail.venue}\n開場： ${detail.openingTime} 開演： ${detail.showTime}\n`
    );
  } else {
    queries.set(
      "details",
      `会場： ${detail.venue}\n開場： ${detail.openingTime} 開演： ${detail.showTime}`
    );
  }
  queries.set("location", `${detail.venue}`);

  return (
    <>
      <LinkButton
        url={`https://calendar.google.com/calendar/u/0/r/eventedit?${queries.toString()}`}
      />
    </>
  );
};
export default AddCalendarButton;
