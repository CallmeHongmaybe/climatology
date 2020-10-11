import { TextField, InputAdornment } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import { ACTIONS } from '../pages/app'
import { useState } from 'react'
import Drawaa from './Drawaa'
import { useSearchBarStyles } from './Styles'

export default function SearchBar({dispatch}) {

    const classes = useSearchBarStyles()

    const [suggested, setSuggested] = useState([])

    const getCities = async (e) => {
        e.target.value
            ? fetch(`../api/autocomplete?keyword=${e.target.value}`).then(res => res.json()).then(res => setSuggested(res))
            : setSuggested([])
    }

    return (
        <div style={{
            alignSelf: 'center',
            background: 'blue',
            borderBottom: '2px solid rgb(12, 102, 240)',
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
                    suggested.map((city, index) =>
                        <li
                            style={{ padding: 2, color: 'black', fontWeight: 'bold', cursor: 'pointer', listStyleType: 'none', fontFamily: 'revert', fontSize: '20px' }}
                            key={index}

                            onClick={() => {
                                dispatch({
                                    type: ACTIONS.GET_CITY_INFO,
                                    payload: {
                                        ...city
                                    }
                                })
                            }}
                        >
                            {city.name}, {city.country}
                        </li>
                    )
                }</ul>
            </>
        </div>

    )

}