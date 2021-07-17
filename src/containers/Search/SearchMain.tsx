import React, { FC, useState, SyntheticEvent } from "react";
import useEventDetailsSearch from "hooks/use-performances-search";
import ListCircular from "components/common/atoms/ListCircular";
import { useLocation, useNavigate } from "react-router";
import EventDetalsList from "components/common/list/EventDetalsList";
import SearchForm from "components/Search/SearchForm";

const SearchMainContainer: FC = () => {
  const query = new URLSearchParams(useLocation().search).get("q");
  const param = query === null || query === undefined ? "" : query;
  const [values, setValues] = useState({ q: param });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { performances, loading } = useEventDetailsSearch(values.q, {
    limit: 30,
  });
  const navigate = useNavigate();

  if (values.q !== param) {
    setValues({ q: param });
  }

  const handleChange2 = (
    targetName: string,
    newValue: string,
    event?: SyntheticEvent
  ) => {
    if (event) event.persist();

    navigate(`?q=${newValue}`, { replace: true });
    setValues((v) => ({ ...v, [targetName]: newValue }));
  };

  const clear = () => {
    navigate("", { replace: true });
    document.getElementById("search")!.focus();
  };

  return (
    <>
      <SearchForm values={values} handleChange={handleChange2} clear={clear} />
      {loading ? (
        <ListCircular />
      ) : (
        <>
          <EventDetalsList eventDetails={performances} />
        </>
      )}
    </>
  );
};

export default SearchMainContainer;
