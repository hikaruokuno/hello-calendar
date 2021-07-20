import React, { FC } from "react";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import { TwitterShareButton, TwitterIcon } from "react-share";
import { getTime, getTweetPrefecture } from "components/item-tools";
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
  const showTime = getTime(detail);
  const endText = type === "top" ? "に来ました！" : "に行きます！";
  const pushEventTracking = () => {
    window.gtag("event", "tweet_click", {
      event_category: "outbound",
      event_label: url,
    });
  };

  return (
    <>
      <TwitterShareButton
        url={url}
        title={`『${detail.title}』${prefecture}${otherText} | ${performanceDay} ${showTime}〜 ${endText} #${titleName.main}`}
        onClick={pushEventTracking}
      >
        <TwitterIcon size={size !== undefined ? size : 32} round />
      </TwitterShareButton>
    </>
  );
};

export default TweetButton;
