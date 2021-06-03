import React, { FC } from "react";

import Tabs from "components/common/tabs/Tabs";
import EventList from "components/common/list/EventList";

const HomeMain: FC = () => (
  <>
    <Tabs />
    <EventList />
  </>
);

export default HomeMain;
