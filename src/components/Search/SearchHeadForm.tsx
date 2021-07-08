import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import React, { useState } from 'react';
import InputBase from "@material-ui/core/InputBase";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
// import useEventDetailsSearch from 'hooks/use-performances-search';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: "#42a5f5",
      "&:hover": {
        backgroundColor: "#42a5f5",
      },
      marginLeft: theme.spacing(1),
      width: "auto",
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "inherit",
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "0ch",
      "&:focus": {
        width: "30ch",
      },
    },
  })
);

const SearchHeadForm = () => {
  const classes = useStyles();
  const [typing, setTyping] = useState(false);
  const navigate = useNavigate();

  const onKeyDownHandler = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.key !== "Enter" || typing) {
      return;
    }
    navigate(`search?q=${e.currentTarget.value}`);
    e.currentTarget.value = "";
    e.currentTarget.blur();
  };

  return (
    <form action="#">
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          type="search"
          placeholder="公演名・会場・都道府県で検索"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ "aria-label": "search" }}
          // onChange={handleChange}
          onKeyDown={onKeyDownHandler}
          onCompositionStart={() => setTyping(true)}
          onCompositionEnd={() => setTyping(false)}
        />
      </div>
    </form>
  );
};

export default SearchHeadForm;
