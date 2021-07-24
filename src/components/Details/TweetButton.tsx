import React, { FC } from "react";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import { TwitterShareButton, TwitterIcon } from "react-share";
import {
  getTime,
  getTweetPrefecture,
  pushEventTracking,
} from "components/item-tools";
import { useLocation } from "react-router";
import { titleName } from "constants/constants";

const TweetButton: FC<{
  detail: EventDetail;
  type?: string;
  size?: number;
}> = ({ detail, type, size }) => {
  const currentUrl = window.location.href;
  const url =
    useLocation().pathname === "/search"
      ? currentUrl.substring(0, currentUrl.indexOf("?"))
      : currentUrl;
  const prefecture = getTweetPrefecture(detail.venue);
  const performanceDay = detail.performanceDay.substring(
    0,
    detail.performanceDay.indexOf("(")
  );
  const otherText =
    detail.otherText && !detail.otherDetail ? ` | ${detail.otherText}` : "";
  const time = getTime(detail);
  const showTime = time === "00:00" ? "" : time;
  const endText = type === "top" ? "に来ました！" : "に行きます！";

  return (
    <>
      <TwitterShareButton
        url={url}
        title={`『${detail.title}』${prefecture}${otherText} | ${performanceDay} ${showTime}〜 ${endText} #${titleName.main}`}
        onClick={() => pushEventTracking("tweet_click", url)}
      >
        <TwitterIcon size={size !== undefined ? size : 32} round />
      </TwitterShareButton>
    </>
  );
};

export default TweetButton;
