import React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
    },
  })
);

const SimpleList: any = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
        <ListItem button>
          <ListItemText primary="○○バースデーイベント" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="ひなフェス2022" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="アンジュルム 起承転結" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="モーニング娘。ライブツアーMOMM" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Juice=Juice LIVE MISSION" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="つばきファクトリー 日本武道館公演" />
        </ListItem>
      </List>
      <Divider />
    </div>
  );
};

export default SimpleList;
