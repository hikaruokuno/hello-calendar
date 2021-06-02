import React, { FC } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import Container from "@material-ui/core/Container";
import Header from "containers/common/Header";
import HomeMain from "containers/Home/HomeMain";
import DetailsMain from "containers/Details/DetailsMain";
import "./App.css";

const App: FC = () => (
  <>
    <Header />
    <Container>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeMain />} />
          <Route path="details" element={<DetailsMain />} />
        </Routes>
      </BrowserRouter>
    </Container>
  </>
);

export default App;
