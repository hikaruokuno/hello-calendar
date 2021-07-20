import React, { FC } from "react";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import LinkButton from "components/common/atoms/LinkButton";
import { getDates, getTime } from "components/item-tools";
import { titleName } from "constants/constants";

const AddCalendarButton: FC<{ detail: EventDetail }> = ({ detail }) => {
  const queries = new URLSearchParams();
  queries.set("action", "TEMPLATE");
  queries.set("text", `『${detail.title}』公演日`);
  const time = getTime(detail) === "" ? "00:00" : getTime(detail);
  queries.set("dates", getDates(detail.performanceDay, time));
  queries.set("ctz", "Asia/Tokyo");

  let detailText = "";
  if (detail.performer) {
    detailText = detailText.concat(`${detail.performer.replace(":", "：")}\n`);
  }
  if (detail.openText && !detail.showText) {
    detailText = detailText.concat(
      `${detail.openText}： ${detail.openingTime}\n`
    );
  } else {
    detailText = detailText.concat(
      `${detail.openText}： ${detail.openingTime} | ${detail.showText}： ${detail.showTime}\n`
    );
  }
  if (detail.otherText && detail.otherDetail) {
    detailText = detailText.concat(
      `${detail.otherText}： ${detail.otherDetail}\n`
    );
  } else if (detail.otherText && !detail.otherDetail) {
    detailText = detailText.concat(`${detail.otherText}\n`);
  }
  queries.set("details", detailText.concat(`@${titleName.main}`));

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
