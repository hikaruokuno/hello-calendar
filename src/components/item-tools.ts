import { differenceInCalendarDays } from "date-fns";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import { titleName } from "constants/constants";

export const getDates = (date: string, time: string) => {
  const slashRemoved = date.replaceAll("/", "");
  const yyyyMMdd = slashRemoved.substring(0, slashRemoved.indexOf("("));

  const hhmm = time.replace(":", "");

  return `${yyyyMMdd}T${hhmm}00/${yyyyMMdd}T${hhmm}00`;
};

export const getDatesLoggedIn = (date: string, time: string) => {
  const slashRemoved = date.replaceAll("/", "-");
  const yyyyMMdd = slashRemoved.substring(0, slashRemoved.indexOf("("));

  return `${yyyyMMdd}T${time}:00`;
};

export const getTime = (detail: EventDetail) => {
  if (detail.openText === "開演") {
    return detail.openingTime;
  }
  if (detail.showText === "開演") {
    return detail.showTime;
  }
  if (detail.openText === "受付") {
    return detail.openingTime;
  }
  if (detail.showText === "受付") {
    return detail.showTime;
  }

  return "";
};

export const getRegularTitle = (beforeTitle: string) => {
  if (beforeTitle.substring(0, 1) === "【") {
    return beforeTitle.substring(beforeTitle.indexOf("】") + 1);
  }

  return beforeTitle;
};

// export const getTweetTitle = (beforeTitle: string) => {
//   if (beforeTitle.length > 48) {
//     return beforeTitle.substring(0, 48).concat('...');
//   }

//   return beforeTitle;
// };

export const getTweetPrefecture = (beforeText: string) => {
  if (beforeText.includes("北海道")) {
    return beforeText.substring(0, beforeText.indexOf(" "));
  }

  return beforeText.substring(0, beforeText.indexOf(" ") - 1);
};

export const isAfterThreeDays = (date: Date) =>
  differenceInCalendarDays(new Date(date), new Date()) <= 2;

export const getDetailText = (detail: EventDetail) => {
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

  return detailText.concat(`@${titleName.main}`);
};

export const setQueries = (detail: EventDetail) => {
  const queries = new URLSearchParams();
  queries.set("action", "TEMPLATE");
  queries.set("text", `『${detail.title}』公演日`);
  const time = getTime(detail) === "" ? "00:00" : getTime(detail);
  queries.set("dates", getDates(detail.performanceDay, time));
  queries.set("ctz", "Asia/Tokyo");
  queries.set("details", getDetailText(detail));
  queries.set("location", `${detail.venue}`);

  return queries;
};

export const setEvents = (detail: EventDetail) => {
  const event = {
    summary: `『${detail.title}』公演日`,
    location: `${detail.venue}`,
    description: getDetailText(detail),
    start: {
      dateTime: getDatesLoggedIn(detail.performanceDay, getTime(detail)),
      timeZone: "Asia/Tokyo",
    },
    end: {
      dateTime: getDatesLoggedIn(detail.performanceDay, getTime(detail)),
      timeZone: "Asia/Tokyo",
    },
  };

  return event;
};

export const sleep = (waitSec: number) =>
  new Promise((resolve) => setTimeout(resolve, waitSec));

export const pushEventTracking = (event: string, eventLabel: string) => {
  window.gtag("event", event, {
    event_category: "outbound",
    event_label: eventLabel,
  });
};
