import { differenceInCalendarDays } from "date-fns";

export const getDates = (date: string, time: string) => {
  const slashRemoved = date.replaceAll("/", "");
  const yyyyMMdd = slashRemoved.substring(0, slashRemoved.indexOf("("));

  const hhmm = time.replace(":", "");

  return `${yyyyMMdd}T${hhmm}00/${yyyyMMdd}T${hhmm}00`;
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
  differenceInCalendarDays(new Date(date), new Date()) <= 3;
