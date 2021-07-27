import React, { FC, useState, SyntheticEvent } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import useEventDetailsSearch from "hooks/use-performances-search";
import ListCircular from "components/common/atoms/ListCircular";
import { useLocation, useNavigate } from "react-router";
import EventDetalsList from "components/common/list/EventDetalsList";
import SearchForm from "components/Search/SearchForm";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    check: {
      marginTop: "8px",
    },
    circular: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(8),
    },
  })
);

const SearchMainContainer: FC = () => {
  const classes = useStyles();
  const query = new URLSearchParams(useLocation().search).get("q");
  const param = query === null || query === undefined ? "" : query;
  const [values, setValues] = useState({ q: param });
  const [past, setPast] = useState({
    checked: false,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { performances, loading } = useEventDetailsSearch(
    values.q,
    {
      limit: 30,
    },
    past.checked
  );
  const navigate = useNavigate();

  if (values.q !== param) {
    setValues({ q: param });
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPast({ ...past, [event.target.name]: event.target.checked });
  };

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

  console.log("search-main");

  return (
    <>
      <SearchForm values={values} handleChange={handleChange2} clear={clear} />
      {loading ? (
        <div className={classes.circular}>
          <ListCircular />
        </div>
      ) : (
        <>
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
            className={classes.check}
          />
          <EventDetalsList eventDetails={performances} />
        </>
      )}
    </>
  );
};

export default SearchMainContainer;
