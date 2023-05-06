import { CircularProgress, BottomNavigationAction, Backdrop } from '@material-ui/core'
import { GpsFixed } from '@material-ui/icons'
import { useState, useContext } from 'react';
import { ACTIONS, InfoContext } from '../../pages/app'
import { climDataTemplate } from "../../services/fetchClimData";
import { sign, verify } from 'jsonwebtoken';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }));

export default function GeolocateButton({ sideEffect }) {
    const classes = useStyles();
    const [loading, setLoading] = useState(false)
    const { dispatch } = useContext(InfoContext)

    return (
        <div>
            <BottomNavigationAction
                label="Find your location"
                showLabel={true}
                icon={<GpsFixed/>}
                onClick={() => {
                    sideEffect()
                    setLoading(true)
                    let user_loc = localStorage.getItem("user_loc")
                    verify(user_loc, process.env.JWT_SECRET_KEY, (err, token) => {
                        if (err) {
                            fetch("../api/geolocate")
                                .then(res => res.json())
                                .then(res => {
                                    let payload = climDataTemplate(res)

                                    dispatch({
                                        type: ACTIONS.GET_CITY_INFO,
                                        payload
                                    })

                                    localStorage.setItem("user_loc", sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '3h' }))
                                })
                                .then(() => setLoading(false))
                                .catch(err => {
                                    throw new Error("Error here. " + err)
                                })
                        }
                        else {
                            dispatch({
                                type: ACTIONS.GET_CITY_INFO,
                                payload: token
                            })
                        }
                    })
                }
                } />
            <Backdrop classes={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    )
}

