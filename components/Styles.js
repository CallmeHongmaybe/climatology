import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 2,
        backgroundColor: theme.palette.common.white,
        color: 'white',
    },
    paper: {
        display: 'flex', justifyContent: 'center', flexFlow: 'column',
        margin: theme.spacing(4)
    },
    weatherBoard: {
        display: 'flex',
        flexFlow: 'row',
        fontWeight: '700',
        color: 'blue'
    },
    sunTime: { display: 'flex', justifyContent: 'space-between', padding: 3 },
    prompt: { fontSize: 20, textAlign: 'center' },
}));

export const useSearchBarStyles = makeStyles((theme) => ({
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