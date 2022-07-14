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
      width: "80vw",
      height: "80vh",
      maxWidth: "2000px",
      maxHeight: "2000px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative"
    },
    paper2: {
      width: "80vw",
      maxWidth: "2000px",
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
    bubbleStyles: {
      
    }
  })
);

function App() {
  const classes = useStyles();
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState([]);
  const [messages, setMessages] = useState([]);
  
  // SEND MESSAGE
  const sendMessage = () => {
    socket.emit('send_message', { message, room });
    setMessages([...messages,
      new Message({
        id: 0,
        message: message,
        senderName: "adidion"
      }), // Gray bubble
    ])
  };
  
  // JOIN A ROOM
  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };
  
  // RETURN A TIMESTAMP
   //const formatDate = (createdAt) => {
   //  const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" }
   //  return new Date(createdAt).toLocaleDateString(undefined, options)
   //}

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
      setMessageReceived(data.body);
      setMessages([...messages,
        new Message({
          id: 1,
          message: data.body,
          senderName: "talker"
        }), // Gray bubble
      ])
     // setCreatedAt(data.createdAt);
    });
  },[messages])

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
      <input
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}> Send Message</button>
      <h1> Message:</h1>
      {messageReceived}
      <button onClick={joinRoom}> Join Room</button>
      <>
    <Paper className={classes.paper}>
      <Paper id="style-1" className={classes.messagesBody}>
      <ChatFeed
      messages={messages} // Boolean: list of message objects
      isTyping={false} // Boolean: is the recipient typing
      hasInputField={false} // Boolean: use our input, or use your own
      showSenderName={true} // show the name of the user who sent the message
      bubblesCentered={true} //Boolean should the bubbles be centered in the feed?
      // JSON: Custom bubble styles
      bubbleStyles={{
        text: {
          fontSize: 15
        },
        chatbubble: {
          borderRadius: 20,
          padding: 15,
          margin: 0
        },
        chatbubbleWrapper: {
          overflow: 'auto',
      },
      // chatbubble: {
      //     backgroundColor: '#0084FF',
      //     borderRadius: 20,
      //     marginTop: 1,
      //     marginRight: 'auto',
      //     marginBottom: 1,
      //     marginLeft: 'auto',
      //     maxWidth: 425,
      //     paddingTop: 8,
      //     paddingBottom: 8,
      //     paddingLeft: 14,
      //     paddingRight: 14,
      //     width: '-webkit-fit-content',
      // },
      // chatbubbleOrientationNormal: {
      //     float: 'right',
      // },
      // recipientChatbubble: {
      //     backgroundColor: '#ccc',
      // },
      // recipientChatbubbleOrientationNormal: {
      //     float: 'left',
      // },
      // p: {
      //     color: '#FFFFFF',
      //     fontSize: 16,
      //     fontWeight: '300',
      //     margin: 0,
      // },
      }}
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
        </>
  </div>
  );
}

export default App;