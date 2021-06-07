import React, { FC } from "react";
// import Button from '@material-ui/core/Button';

const LinkButton: FC = () => {
  const queries = new URLSearchParams();
  queries.set("action", "TEMPLATE");
  queries.set("text", "『title』");
  queries.set("dates", "20220327T160000/20220327T160000");
  queries.set("ctz", "Asia/Tokyo");
  // queries.set('details', '開場： 15：00 開演：16:00');
  queries.set("location", "中野サンプラザ, 東京都中野区中野４丁目１−１");
  // queries.set('action', 'TEMPLATE');
  // queries.set('text', '『ひなフェス2022』');
  // queries.set('dates', '20220327T160000/20220327T160000');
  // queries.set('ctz', 'Asia/Tokyo');
  // queries.set('details', '開場： 15：00 開演：16:00');
  // queries.set('location', 'North Pole');

  // const url = `https://calendar.google.com/event?${queries.toString()}`;
  // const url = `https://calendar.google.com/calendar/u/0/r/eventedit?${queries.toString()}`;
  const url = `https://calendar.google.com/calendar/gp#~calendar:view=e&bm=1?${queries.toString()}`;
  // const url = `https://calendar.google.com/calendar/render?${queries.toString()}`;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      Add to Google Calendar
      {/* <Button size="small">Add to Google Calendar</Button> */}
    </a>
  );
};
export default LinkButton;
