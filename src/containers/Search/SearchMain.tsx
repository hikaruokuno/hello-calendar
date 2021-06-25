import React, { FC, useState } from "react";
import useEventDetailsSearch from "hooks/use-performances-search";
import ListCircular from "components/common/atoms/ListCircular";
import { useLocation } from "react-router";

const SearchMainContainer: FC = () => {
  const query = new URLSearchParams(useLocation().search);
  const [value, setValue] = useState(query.get("q")!);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { performances, loading } = useEventDetailsSearch(value, { limit: 20 });
  if (value !== query.get("q")) {
    setValue(query.get("q")!);
  }

  return (
    <>
      {loading ? (
        <ListCircular />
      ) : (
        performances.map((data) => (
          <p>
            {data.title}
            <br />
            {data.venue}
            <br />
            {data.showText} {data.showTime}
          </p>
        ))
      )}
    </>
  );
};

export default SearchMainContainer;
