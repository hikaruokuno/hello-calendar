import React, { FC } from "react";
import { Link } from "react-router-dom";
import ListItemText from "@material-ui/core/ListItemText";

const EventName: FC = () => (
  <Link to="/details">
    <ListItemText primary="ひなフェス2022" />
  </Link>
);

export default EventName;
