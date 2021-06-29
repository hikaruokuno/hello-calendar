import React, { FC, useContext } from "react";
import { EventTypeContext } from "contexts";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

const CenteredTabs: FC = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const { type, setType } = useContext(EventTypeContext);

  const handleChange = (event: React.ChangeEvent<any>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Paper className={classes.root}>
      <Tabs
        value={type === "mEvents" ? 1 : value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="ハロプロ" onClick={() => setType("hEvents")} />
        <Tab label="M-line" onClick={() => setType("mEvents")} />
        <Tab label="公演一覧" onClick={() => setType("performances")} />
      </Tabs>
    </Paper>
  );
};

export default CenteredTabs;
