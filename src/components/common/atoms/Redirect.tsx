import React from "react";
import { Navigate, useLocation } from "react-router";

const Redirect = () => {
  const { pathname, search } = useLocation();
  const fullPath = search ? pathname + search : pathname;
  const url = fullPath.replace("_", "");

  return <Navigate to={url} replace />;
};

export default Redirect;
