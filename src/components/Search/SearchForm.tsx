import React, { FC } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";

import ClearIcon from "@material-ui/icons/Clear";
import { IconButton } from "@material-ui/core";
import { titleName } from "constants/constants";

type SearchFormProps = {
  handleChange?: (targetName: string, newValue: string) => void;
  // onKeyDownHandler: () => e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement> void;
  values?: { q: string };
  clear: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: "100%",
      marginTop: "8px",
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
  })
);

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

const SearchForm: FC<SearchFormProps> = ({
  // onKeyDownHandler = () => undefined,
  handleChange = () => undefined,
  values = { q: "" },
  clear = () => undefined,
}) => {
  const classes = useStyles();

  return (
    <form onSubmit={handleSubmit}>
      <Paper className={classes.root}>
        <TextField
          id="search"
          type="text"
          className={classes.input}
          placeholder={titleName.search}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => clear()}>
                <ClearIcon />
              </IconButton>
            ),
          }}
          onChange={(event) => handleChange("q", String(event.target.value))}
          // defaultValue={values.q}
          // onKeyDown={onKeyDownHandler}
          // autoFocus
          value={values.q}
        />
      </Paper>
    </form>
  );
};

export default SearchForm;
