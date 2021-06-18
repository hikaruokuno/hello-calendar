import React, { FC } from "react";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import { TwitterShareButton, TwitterIcon } from "react-share";
import { getRegularTitle, getTweetPrefecture } from "components/item-tools";

const TweetButton: FC<{ title: string; detail: EventDetail }> = ({
  title,
  detail,
}) => {
  const url = window.location.href;
  const prefecture = getTweetPrefecture(detail.venue);
  const performanceDay = detail.performanceDay.substring(
    0,
    detail.performanceDay.indexOf("(")
  );
  const showTime = detail.openText.includes("開演")
    ? detail.openingTime
    : detail.showTime;

  return (
    <>
      <TwitterShareButton
        url={url}
        title={`『${getRegularTitle(
          title
        )}』${prefecture} | ${performanceDay} ${showTime}〜 に行きます！`}
        hashtags={["ハロカレ"]}
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>
    </>
  );
};

export default TweetButton;
