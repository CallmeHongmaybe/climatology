import { useState } from "react";
import { useDrawerStyle } from '../Styles'
import {
    Drawer,
    BottomNavigation,
    Fab
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import GeolocateButton from "./GeolocateButton";
import RandomButton from './RandomButton'


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
            <GeolocateButton sideEffect={() => toggleDrawer()} />
            <RandomButton sideEffect={() => toggleDrawer()} />
            {/* Next one - Query climate for user-selected area: https://docs.mapbox.com/mapbox-gl-js/example/using-box-queryrenderedfeatures/ */}
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
