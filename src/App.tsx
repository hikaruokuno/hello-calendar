import React, { FC } from "react";
import { Route, Routes } from "react-router";

import Container from "@material-ui/core/Container";
import Header from "containers/common/Header";
import EventDetailsMain from "containers/Details/EventDetailMain";
import "./App.css";
import Home from "components/Home";

const App: FC = () => (
  <>
    <Header />
    <Container>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="details/:type/:eventId" element={<EventDetailsMain />} />
      </Routes>
    </Container>
  </>
);

export default App;
