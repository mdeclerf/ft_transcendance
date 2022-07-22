import './App.css';
import io from 'socket.io-client'
import { useEffect, useState } from "react";
import { ChatFeed, Message } from "react-chat-ui";
import { Paper } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles } from "@material-ui/core/styles";

//import Bubble from 'react-bubble';
//import {View} from 'react-view';

const socket = io('http://localhost:3001');

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      width: "100%",
      height: "100vh",
      display: "inline-block",
      alignItems: "right",
      flexDirection: "column",
      position: "relative",
      backgroundColor: "rgb(220,220,220)",
      verticalAlign: "right",
    },
    container: {
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0",
    },
    messagesBody: {
      width: "calc( 100% - 000px )",
      margin: 0,
      overflowY: "scroll",
      height: "calc( 100% - 80px )",
      backgroundColor: "rgb(220,220,220)"
    },
    wrapForm : {
        display: "flex",
        justifyContent: "center",
        width: "100%",
        margin: `0`
    },
    wrapText  : {
        width: "100%"
    },
    button: {
      backgroundColor: "#fff",
      borderColor: "#1D2129",
      borderStyle: "solid",
      borderRadius: 20,
      borderWidth: 2,
      color: "#1D2129",
      fontSize: 18,
      // fontWeight: "300",
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 16,
      paddingRight: 16,
      outline: "none"
    },
    selected: {
      color: "#fff",
      backgroundColor: "#0084FF",
      borderColor: "#0084FF"
    }
  })
);

const customBubble = (props: any) => (
    <div className="imessage">
    <p className={`${props.message.id ? "from-them" : "from-me"}`}>{props.message.message}</p>
    </div>
);



function App() {
  const classes = useStyles();
  const [room, setRoom] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [rooms, setRooms] = useState<Array<number>>([]);

  // SEND MESSAGE
const sendMessage = () => {
    socket.emit('send_message', { message, room });
    setMessages([...messages,
      new Message({
        id: 0,
        message: message,
        senderName: "adidion"
      }),
    ])
  };
  
  // JOIN A ROOM
  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const joinChannel = (room_number: number) => {
    setRoom(room_number.toString());
      socket.emit("join_room", room_number.toString());
  };
  

  // SEND THE MESSAGE AND RESET (due to the onClick accepting only one function)
  function send_and_reset()
  {
    if (message !== "")
      sendMessage();
    reset();
  }

  
  // DEAL WITH EVENTS
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages([...messages,
        new Message({
          id: 1,
          message: data.body,
          senderName: "talker"
        }),
      ])
     // setCreatedAt(data.createdAt);
    });
    socket.on("joined_room", (data) => {
      messages.splice(0, messages.length);
      setMessages([]);
      data.forEach(function(value: any, key: any) {
        messages.push(new Message({
            id: 1,
            message: data[key].body,
            senderName: "talker"
          }),
        );
        setMessages([...messages]);
      });
    });
    socket.on("connected", (data) => {
      rooms.splice(0, rooms.length);
      setRooms([]);
      data.forEach(function(value: any, key: any) {
        rooms.push(data[key].room_number);
      });
      setRooms([...rooms]);
      if (room === "")
        socket.emit("join_room", "0");
      console.log("here");
    });
  }, [messages, rooms, room])

  // RESET THE FORM
  function reset() {
    (document.getElementById("textareaInput") as HTMLFormElement).reset();
  }
  
  // RETURN TO RENDER
  return (
  <>
    <div className="columns">
      <div className="col1">
        <Paper className={classes.paper}>
          <div> {rooms.map(room_number => {
            return (
              <button key={room_number} onClick={() =>joinChannel(room_number)}>
                {room_number}
              </button>
            )
          })}
          </div>
          <input
            placeholder="Room Number..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}> Join Room</button>
        </Paper>
      </div>
      <div className="col2">
        <Paper className={classes.paper}>
          <Paper id="style-1" className={classes.messagesBody}>
            <ChatFeed
              messages={messages} // Boolean: list of message objects
              isTyping={false} // Boolean: is the recipient typing
              hasInputField={false} // Boolean: use our input, or use your own
              showSenderName={true} // show the name of the user who sent the message
              bubblesCentered={true} //Boolean should the bubbles be centered in the feed?
              // JSON: Custom bubble styles
              chatBubble={true && customBubble}
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
                    if (message !== "")
                    sendMessage();
                    event.preventDefault();//avoid refreshing at each enter
                    reset();//clear the form
                    setMessage('');
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
    </div>
  </>
  );
}

export default App;