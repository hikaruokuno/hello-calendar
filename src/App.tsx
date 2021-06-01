import React, { FC } from "react";
import "./App.css";
import Container from "@material-ui/core/Container";
import Header from "./containers/common/Header";
import EventNameList from "./containers/Home/EventNameList";

const App: FC = () => (
  <div className="App">
    <Container>
      <Header />
      <EventNameList />
    </Container>
  </div>
);

export default App;
