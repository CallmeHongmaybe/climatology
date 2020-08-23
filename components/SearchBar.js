import { TextField, InputAdornment } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
// import clsx from 'clsx'
import cities from 'cities.json'
import { useState } from 'react'

export default function SearchBar() {

    const [suggested, setSuggested] = useState([])

    const getCities = (e) => {
        e.target.value
          ? setSuggested(cities.filter(el => el.name.includes(e.target.value)).slice(0, 4))
          : setSuggested([])
      }

      console.log("SearchBar rerenders")

    return (
        <>
            <TextField
                placeholder="Type a place name here"
                style={{width: '90%'}}
                InputProps={{
                    startAdornment: <InputAdornment position="start" style={{ marginLeft: '10px' }}>
                        <SearchIcon />
                    </InputAdornment>,
                }}
                onChange={getCities}
            />
            <ul style={{ marginTop: -15, position: 'fixed', background: '#ffd', width: 'inherit' }}>{
                suggested.map((city, index) =>
                    <li
                        style={{ padding: 2, color: 'black', fontWeight: 'bold', cursor: 'pointer', listStyleType: 'none', fontFamily: 'revert', fontSize: '20px' }}
                        key={index}
                        onClick={
                            () => {
                                console.log("Consoled")
                            }
                        }
                    >
                        {city.name}, {city.country}
                    </li>
                )
            }</ul>
        </>
    )

}