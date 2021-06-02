import React, { FC } from "react";
import Button from "@material-ui/core/Button";

const LinkButton: FC = () => {
  const queries = new URLSearchParams();
  queries.set("action", "TEMPLATE");
  queries.set("text", "『ひなフェス2022』公演日");
  queries.set("location", "幕張メッセ 国際展示場1・2 ホール");
  queries.set("details", "開場： 15：00 開演：16:00");
  queries.set("dates", "20220327T1600/20220327T1600");

  const url = `https://www.google.com/calendar/event?${queries.toString()}`;

  return (
    <a href={url}>
      <Button size="small">Googleカレンダーに追加する</Button>
    </a>
  );
};
export default LinkButton;
