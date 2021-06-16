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

  return (
    <>
      <TwitterShareButton
        url={url}
        title={`『${getRegularTitle(
          title
        )}』${prefecture}公演 ${detail.performanceDay.substring(5)} ${
          detail.showTime
        }〜 にいきます！`}
        hashtags={["ハロカレ"]}
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>
    </>
  );
};

export default TweetButton;
