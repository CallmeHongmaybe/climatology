import { Casino } from '@material-ui/icons'
import { BottomNavigationAction } from '@material-ui/core'
import { useContext } from 'react';
import { ACTIONS, InfoContext } from '../../pages/app'
import { climDataTemplate } from "../../services/fetchClimData";

export default function RandomButton({ sideEffect }) {

    const { dispatch } = useContext(InfoContext)

    return (
        <BottomNavigationAction
            label="Go to a random place"
            showLabel={true}
            icon={<Casino />}
            onClick={() => {
                sideEffect()
                fetch(`../api/getrandomloc`)
                    .then(res => res.json())
                    .then(res => {

                        let payload = climDataTemplate(res)

                        dispatch({
                            type: ACTIONS.GET_CITY_INFO,
                            payload
                        })

                    })
                    .catch(err => {
                        throw new Error("Error here. " + err)
                    })
            }}
        />
    )
}