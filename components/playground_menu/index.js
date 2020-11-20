import { useState } from "react";
import { useDrawerStyle } from '../Styles'
import {
    Drawer,
    BottomNavigation,
    BottomNavigationAction,
    Fab
} from "@material-ui/core";
import { LocationOn, Menu } from "@material-ui/icons";
import GeolocateButton from "./GeolocateButton";


export default function SideDrawer() {
    const classes = useDrawerStyle();
    const [state, setState] = useState(false);
    const [value, setValue] = useState();

    const toggleDrawer = (event) => {
        if (
            event &&
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }

        setState(!state);
    };

    const BottomNav = () => (
        <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            showLabels
            className={classes.fullList}
        >
            <GeolocateButton sideEffect={() => toggleDrawer()}/>
            <BottomNavigationAction
                label="Show city clusters"
                icon={<LocationOn />}
                onClick={() => toggleDrawer()}
            />
        </BottomNavigation>
    );

    return (

        <div>
            <Fab
                color="secondary"
                className={classes.rightCorner}
                onClick={() => toggleDrawer()}
            >
                <Menu />
            </Fab>
            <Drawer
                BackdropProps={{ invisible: true }}
                anchor={"bottom"}
                open={state}
                onClose={() => toggleDrawer()}
                onOpen={() => toggleDrawer()}
            >
                {BottomNav()}
            </Drawer>
        </div>

    );
}
