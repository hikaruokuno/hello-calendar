import React, { FC } from "react";
import Button from "@material-ui/core/Button";

const LinkButton: FC<{ url: string }> = ({ url }) => (
  <a href={url} target="_blank" rel="noopener noreferrer">
    <Button size="small">Googleカレンダーに追加する</Button>
  </a>
);
export default LinkButton;
