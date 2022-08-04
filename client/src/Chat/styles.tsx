import { createStyles, makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: any) =>
  createStyles({
    // PAPIER DE GAUCHE
    paper: {
      width: "100%",
      height: "calc(100vh - 64px)",
      position: "relative",
      backgroundColor: "rgba(0, 0, 0, 0)",
      overflowY: "scroll",
      padding: "0",
    },
    // ICONE SETTINGS
    settings: {
      alignSelf: "flex-end",
      display: "inline-block",
      position: 'absolute',
      top: "0px",
      right: "20px",
    },
    // BOUTON TRANSPARENT SETTINGS
    buttonSettings: {
      alignSelf: "flex-end",
      display: "inline-block",
      position: 'absolute',
      top: "0px",
      right: "20px",
      padding: "16px",
      backgroundColor: "transparent",
      border: "0"
    },
    // PAPIER DE DROITE
    paper2: {
      width: "100%",
      height: "calc(100vh - 64px)",
      position: "relative",
      backgroundColor: "rgba(0, 0, 0, 0)",
      padding: "0",
    },
    // BOUTON CREATE ROOM
    createRoom: {
      width: "100%",
      height: "5vh",
      backgroundColor: "rgba(0, 0, 0, 0)"
    },
    container: {
      width: "100vw",
      height: "100vh",
      alignItems: "center",
      justifyContent: "center",
      margin: "0",
      padding: "0"
    },
    // HISTORIQUE DE MESSAGES
    messagesBody: {
      width: "100%",
      margin: 0,
      height: "calc( 100% - 80px )",
      backgroundColor: "rgba(0, 0, 0, 0)",
      display: "flex",
      flexDirection: "column-reverse",
    },
    // FORM D ENVOI DE MESSAGES
    wrapForm : {
      display: "flex",
      minWidth: "0",
      justifyContent: "center",
      width: "100%",
      paddingTop: "1vh",
      margin: `0`,
    },
    wrapText  : {
      width: "100%"
    },
    // BOUTON D ENVOI DE TEXTE
    button: {
      // backgroundColor: "#fff",
      borderColor: "#1D2129",
      borderStyle: "solid",
      borderRadius: 20,
      borderWidth: 2,
      color: "#1D2129",
      fontSize: 18,
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 16,
      paddingRight: 16,
      outline: "none"
    },
    selected: {
      color: "#fff",
    }
})
);
