import React, { FC } from "react";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import LinkButton from "components/common/atoms/LinkButton";
import { getDates, getRegularTitle } from "components/item-tools";

const AddCalendarButton: FC<{ title: string; detail: EventDetail }> = ({
  title,
  detail,
}) => {
  const queries = new URLSearchParams();
  queries.set("action", "TEMPLATE");
  queries.set("text", `『${getRegularTitle(title)}』公演日`);
  queries.set(
    "dates",
    getDates(
      detail.performanceDay,
      detail.openText.includes("開演") ? detail.openingTime : detail.showTime
    )
  );
  queries.set("ctz", "Asia/Tokyo");

  let detailText = `会場： ${detail.venue}\n`;
  if (detail.performer) {
    detailText = detailText.concat(`${detail.performer.replace(":", "：")}\n`);
  }
  detailText = detailText.concat(
    `${detail.openText}： ${detail.openingTime}, ${detail.showText}： ${detail.showTime}\n`
  );
  if (detail.otherText && detail.otherDetail) {
    detailText = detailText.concat(
      `${detail.otherText}： ${detail.otherDetail}`
    );
  }
  queries.set("details", detailText);

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
