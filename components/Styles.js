import { makeStyles } from '@material-ui/core'

const root = {
    flexGrow: 2,
    color: 'white',
}

export const useStyles = makeStyles((theme) => ({
    root,
    paper: {
        display: 'flex', justifyContent: 'center', flexFlow: 'column',
        margin: theme.spacing(4)
    },
    weatherBoard: {
        display: 'flex',
        flexFlow: 'row',
        fontWeight: '700',
        color: 'black'
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

export const useClimateCardStyle = makeStyles((theme) => ({
    root,
    paper: {
        padding: theme.spacing(2),
        margin: "auto",
        maxWidth: '100%'
    },
    code: {
        fontSize: "55px",
        textAlign: "center"
    }
}));

export const useControlPanelStyle = () => {

    const width = 25 // percent 

    return {
        background: "white",
        width: `${width}%`,
        padding: "2",
        display: "flex",
        justifyContent: "center",
        flexFlow: "column",
        alignItems: "center",
        border: "2px solid rgba(0,0,0, 0.2)",
        position: "absolute",
        bottom: 10,
        left: `${50 - width / 2}%`, 
    }
}

export const useDrawerStyle = makeStyles({
    fullList: {
        width: "auto", 
    },
    rightCorner: {
        right: 10,
        bottom: 10,
        position: "absolute"
    }
});