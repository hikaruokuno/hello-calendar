import React, { FC } from "react";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import { TwitterShareButton, TwitterIcon } from "react-share";
import { getTweetPrefecture } from "components/item-tools";
import { useLocation } from "react-router";

const TweetButton: FC<{
  detail: EventDetail;
  type?: string;
  size?: number;
}> = ({ detail, type, size }) => {
  const currentUrl = window.location.href.replace("_", "");
  const url =
    useLocation().pathname === "/search"
      ? currentUrl.substring(0, currentUrl.indexOf("?"))
      : currentUrl;
  const prefecture = getTweetPrefecture(detail.venue);
  const performanceDay = detail.performanceDay.substring(
    0,
    detail.performanceDay.indexOf("(")
  );
  const showTime = detail.openText.includes("開演")
    ? detail.openingTime
    : detail.showTime;
  const endText = type === "top" ? "に来ました！" : "に行きます！";

  return (
    <>
      <TwitterShareButton
        url={url}
        title={`『${detail.title}』${prefecture} | ${performanceDay} ${showTime}〜 ${endText} #ハロカレ`}
      >
        <TwitterIcon size={size !== undefined ? size : 32} round />
      </TwitterShareButton>
    </>
  );
};

export default TweetButton;
