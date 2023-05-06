import { TextField, InputAdornment } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import { ACTIONS, InfoContext } from '../pages/app'
import { useContext, useState } from 'react'
import Drawaa from './Drawaa'
import { useSearchBarStyles } from './Styles'

const lineStyle = { padding: 2, color: 'black', fontWeight: 'bold', cursor: 'pointer', listStyleType: 'none', fontFamily: 'revert', fontSize: '20px' }

export default function SearchBar() {

    const classes = useSearchBarStyles()

    const { dispatch } = useContext(InfoContext)

    const [suggestion, setSuggestion] = useState([])

    const getCities = async (e) => {
        e.target.value
            ? fetch(`../api/autocomplete?keyword=${e.target.value}`).then(res => res.json()).then(res => setSuggestion(res))
            : setSuggestion([])
    }

    return (
        <div style={{
            alignSelf: 'center',
            background: 'blue',
            position: 'relative',
            width: 'inherit'
        }}>
            {/* add button to the right drawer - https://material-ui.com/components/drawers/ */}
            <>
                <div style={{ display: 'flex', flexFlow: 'row' }}>
                    <TextField
                        className={classes.root}
                        placeholder="Type a place name here"
                        variant="outlined"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <Drawaa />
                            </InputAdornment>,
                            endAdornment: <SearchIcon />
                        }}
                        onChange={getCities}
                    />
                </div>
                <ul className={classes.autoCompleteMenu}>
                    {
                        suggestion.map((city, index) =>
                            <li
                                style={lineStyle}
                                key={index}
                                onClick={() => {
                                    const [lng, lat] = city.location.coordinates
                                    dispatch({
                                        type: ACTIONS.GET_CITY_INFO,
                                        payload: {
                                            ...city, lat, lng
                                        }
                                    })
                                    setSuggestion([])
                                }}
                            >
                                {city.name}, {city.country}
                            </li>
                        )
                    }
                </ul>
            </>
        </div>

    )

}
