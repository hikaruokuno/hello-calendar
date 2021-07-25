import React, { FC } from "react";
import { Route, Routes } from "react-router";
import { createMuiTheme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Header from "containers/common/Header";
import EventDetailsMain from "containers/Details/EventDetailMain";
import "./App.css";
import Home from "components/Home";
import Search from "components/Search";
import Performance from "containers/Performance/PerformanceMain";
import { ThemeProvider } from "@material-ui/styles";
import addGtag from "utils/add-gtag";
import useTracking from "hooks/use-tracking";
import Redirect from "components/common/atoms/Redirect";
import Signin from "components/Signin";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2196f3",
    },
  },
});

const App: FC = () => {
  addGtag();
  useTracking();

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Container fixed>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="details/:type/:eventId" element={<EventDetailsMain />} />
          <Route path="_details/:type/:eventId" element={<Redirect />} />
          <Route path="search" element={<Search />} />
          <Route path="_search" element={<Redirect />} />
          <Route path="peformances" element={<Performance />} />
          <Route path="_peformances" element={<Redirect />} />
          <Route path="login" element={<Signin />} />
          {/* <Route path="privacy" element={<Signin />} /> */}
        </Routes>
      </Container>
    </ThemeProvider>
  );
};

export default App;
