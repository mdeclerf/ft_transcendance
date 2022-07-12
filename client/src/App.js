import './App.css';
import io from 'socket.io-client'
import { useEffect, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { MessageLeft, MessageRight } from "./Message.js";
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import Button from '@material-ui/core/Button';

const socket = io('http://localhost:3001');

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      width: "80vw",
      height: "80vh",
      maxWidth: "500px",
      maxHeight: "700px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative"
    },
    paper2: {
      width: "80vw",
      maxWidth: "500px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative"
    },
    container: {
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    messagesBody: {
      width: "calc( 100% - 20px )",
      margin: 10,
      overflowY: "scroll",
      height: "calc( 100% - 80px )"
    },
    wrapForm : {
        display: "flex",
        justifyContent: "center",
        width: "95%",
        margin: `${theme.spacing(0)} auto`
    },
    wrapText  : {
        width: "100%"
    },
    button: {
        margin: theme.spacing(1),
    },
  })
);


function App() {
  const classes = useStyles();
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [createdAt, setCreatedAt] = useState('');
  const messagesRender = "";
  
  // SEND MESSAGE
  const sendMessage = () => {
    socket.emit('send_message', { message, room });
  };
  
  // JOIN A ROOM
  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };
  
  // RETURN A TIMESTAMP
  const formatDate = (createdAt) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" }
    return new Date(createdAt).toLocaleDateString(undefined, options)
  }
  
  // TRY TO MAKE THE FEED
  const addMessage = (messageReceived, createdAt, messagesRender) => {
    messagesRender += <MessageLeft message={messageReceived} timestamp={formatDate(createdAt)} photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c" displayName="talker" avatarDisp={true} />;
    console.log(messagesRender);
    return (messagesRender);
  }

  // SEND THE MESSAGE AND RESET (due to the onClick accepting only one function)
  function send_and_reset()
  {
    sendMessage();
    reset();
  }
  
  // DEAL WITH EVENTS
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.body);
      setCreatedAt(data.createdAt);
    });
  },[])

  // RESET THE FORM
  function reset() {
    document.getElementById("textareaInput").reset();
  }
  
  // RETURN TO RENDER
  return (
    <div className="App">
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}> Join Room</button>
      <input
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}> Send Message</button>
      <h1> Message:</h1>
      {messageReceived}
    <Paper className={classes.paper}>
      <Paper id="style-1" className={classes.messagesBody}>
      <div {...messagesRender} className={addMessage(messageReceived, createdAt, messagesRender)}/>
        {/* //{addMessage(messageReceived, createdAt, messagesRender)} */}
        <MessageRight
          message="coucou"
          photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
          displayName="adidion"
          avatarDisp={true}
        />
        <MessageRight
          message="salut"
          photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
          displayName="adidion"
          avatarDisp={false}
        />
      </Paper>
      <>
            <form className={classes.wrapForm}  noValidate autoComplete="off" id="textareaInput">
            <TextField
                placeholder='type your message'
                onChange={(event) => {
                  setMessage(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter')
                  {
                    sendMessage();
                    event.preventDefault();//avoid refreshing at each enter
                    reset();//clear the form
                  }
                }}
            />
            <Button
               onClick={send_and_reset}>
                <SendIcon />
            </Button>
            </form>
        </>
    </Paper>
  </div>
  );
}

export default App;