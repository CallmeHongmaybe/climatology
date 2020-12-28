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
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    spread: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

export const useControlPanelStyle = () => {

    const width = 30 // percent 

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

export const useBackDropStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

export const useAccordionStyle = makeStyles((theme) => ({
    root: {
        width: "90%"
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular
    },
    accordionTab: {
        background: "linear-gradient(15deg, #FAF 0%, rgba(12,102,240) 100%)",
        display: "flex",
        justifyContent: "space-around",
        cursor: "pointer",
        boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
        "&:hover": {
            background: "linear-gradient(45deg, #FAF 5%, rgba(12,102,240) 95%)"
            // https://stackoverflow.com/questions/52596070/materialui-custom-hover-style
        }
    },
    typography: {
        fontWeight: theme.typography.fontWeightLight,
        fontSize: theme.typography.pxToRem(18),
        color: "white"
    }
}))