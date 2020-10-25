import React, { useState } from "react";
import { List, Button, Drawer, Divider, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Mail, Menu, BugReport } from '@material-ui/icons'


export default function Drawaa() {
    const [state, setState] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }

        setState(open);
    };

    return (
        <div>
            <Button onClick={toggleDrawer(!state)}>
                <Menu />
            </Button>
            <Drawer
                width="40%"
                anchor="left"
                open={state}
                onClose={toggleDrawer(false)}
            >
                <List>
                    {["Find similar climates", "Hit me up", "Add missing place"].map((text) => (
                        <ListItem button key={text}>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    <ListItem button>
                        <ListItemIcon><Mail /></ListItemIcon>
                        <ListItemText primary="Feedback" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <BugReport />
                        </ListItemIcon>
                        <ListItemText primary="Report bugs" />
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
}
