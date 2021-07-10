import React, { FC } from "react";
import { Route, Routes } from "react-router";
import { createMuiTheme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Header from "containers/common/Header";
import Footer from "containers/common/Footer";
import EventDetailsMain from "containers/Details/EventDetailMain";
import "./App.css";
import Home from "components/Home";
import Search from "components/Search";
import Performance from "containers/Performance/PerformanceMain";
import { ThemeProvider } from "@material-ui/styles";
import addGtag from "utils/add-gtag";
import useTracking from "hooks/use-tracking";

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
    <>
      <ThemeProvider theme={theme}>
        <Header />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="details/:type/:eventId"
              element={<EventDetailsMain />}
            />
            <Route
              path="_details/:type/:eventId"
              element={<EventDetailsMain />}
            />
            <Route path="search" element={<Search />} />
            <Route path="_search" element={<Search />} />
            <Route path="peformances" element={<Performance />} />
            <Route path="_peformances" element={<Performance />} />
          </Routes>
        </Container>
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default App;
