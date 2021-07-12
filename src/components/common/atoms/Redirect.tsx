import React from "react";
import { Navigate, useLocation } from "react-router";

const Redirect = () => {
  const { pathname } = useLocation();
  const url = pathname.replace("_", "");

  return <Navigate to={url} replace />;
};

export default Redirect;
