import { TextField, InputAdornment } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import { useState } from 'react'
import { ACTIONS } from '../pages/find-climates'
import { makeStyles } from '@material-ui/core'
import Drawaa from './Drawaa'

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(2),
        backgroundColor: 'white',
        width: '90%',
        padding: 'auto',
        alignSelf: 'center'
    },
    autoCompleteMenu: {
        marginTop: theme.spacing(-2),
        marginLeft: theme.spacing(2),
        alignSelf: 'center',
        position: 'absolute', background: 'white', zIndex: 1, width: '90%', margin: 'auto', border: '1px solid black'
    }
}))

export default function SearchBar({ dispatch }) {

    const classes = useStyles()

    const [suggested, setSuggested] = useState([])

    const getCities = async (e) => {
        e.target.value
            ? fetch(`../api/autocomplete?keyword=${e.target.value}`).then(res => res.json()).then(res => setSuggested(res)) 
            : setSuggested([])
    }

    return (
        <div style={{
            alignSelf: 'center',
            background: 'skyblue',
            borderBottom: '2px solid rgb(12, 102, 240)',
            position: 'relative',
            width: 'inherit'
        }}>
            {/* add button to the right drawer - https://material-ui.com/components/drawers/ */}
            <>
                <div style={{display: 'flex', flexFlow: 'row'}}>
                    <TextField
                        className={classes.root}
                        placeholder="Type a place name here"
                        variant="outlined"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                  <Drawaa />
                            </InputAdornment>,
                            endAdornment: <SearchIcon/>
                        }}
                        onChange={getCities}
                    />
                </div>
                <ul className={classes.autoCompleteMenu}>{
                    suggested.map((city, index) =>
                        <li
                            style={{ padding: 2, color: 'black', fontWeight: 'bold', cursor: 'pointer', listStyleType: 'none', fontFamily: 'revert', fontSize: '20px' }}
                            key={index}
                            onClick={
                                () => dispatch({
                                    type: ACTIONS.GET_CITY_INFO, 
                                    payload: {
                                        name: city.name,
                                        country: city.country,
                                        lat: city.lat,
                                        lon: city.lng
                                    }
                                })
                            }
                        >
                            {city.name}, {city.country}
                        </li>
                    )
                }</ul>
            </>
        </div>

    )

}