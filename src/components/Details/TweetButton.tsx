import React, { FC } from "react";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import { TwitterShareButton, TwitterIcon } from "react-share";
import { getRegularTitle, getTweetPrefecture } from "components/item-tools";

const TweetButton: FC<{
  title: string;
  detail: EventDetail;
  type?: string;
  size?: number;
}> = ({ title, detail, type, size }) => {
  const url = window.location.href;
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
        title={`『${getRegularTitle(
          title
        )}』${prefecture} | ${performanceDay} ${showTime}〜 ${endText}`}
        hashtags={["ハロカレ"]}
      >
        <TwitterIcon size={size !== undefined ? size : 32} round />
      </TwitterShareButton>
    </>
  );
};

export default TweetButton;
