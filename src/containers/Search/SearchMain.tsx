import React, { FC, useState } from "react";
import useEventDetailsSearch from "hooks/use-performances-search";
import ListCircular from "components/common/atoms/ListCircular";
import { useLocation } from "react-router";
import EventDetalsList from "components/common/list/EventDetalsList";
import SearchForm from "components/Search/SearchForm";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const SearchMainContainer: FC = () => {
  const query = new URLSearchParams(useLocation().search);
  const [value, setValue] = useState(query.get("q")!);
  const [past, setPast] = useState({
    checked: false,
  });
  console.log(past);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { performances, loading } = useEventDetailsSearch(
    value,
    {
      limit: 20,
    },
    past.checked
  );

  if (value !== query.get("q")) {
    setValue(query.get("q")!);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPast({ ...past, [event.target.name]: event.target.checked });
  };

  return (
    <>
      {loading ? (
        <ListCircular />
      ) : (
        <>
          <SearchForm />
          <FormControlLabel
            control={
              <Checkbox
                checked={past.checked}
                onChange={handleChange}
                name="checked"
                color="primary"
                size="small"
              />
            }
            label="過去の公演を含む"
            color="secondary"
          />
          <EventDetalsList eventDetails={performances} />
        </>
      )}
    </>
  );
};

export default SearchMainContainer;
