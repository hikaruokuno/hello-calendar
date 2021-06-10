import React, { FC } from "react";
import Button from "@material-ui/core/Button";

const LinkButton: FC<{ url: string; device: string }> = ({ url, device }) => (
  <a href={url} target="_blank" rel="noopener noreferrer">
    <Button size="small">Googleカレンダーに追加する({device}用)</Button>
  </a>
);
export default LinkButton;
