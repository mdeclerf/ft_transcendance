import './Chat.css';
import { useEffect, useState } from "react";
import { ChatFeed, Message } from "react-chat-ui";
import { Paper } from '@mui/material';
import { TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { createStyles, makeStyles } from '@mui/styles';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import Button from '@mui/material/Button';
import { Socket } from 'socket.io-client';
import { useFetchCurrentUser } from "../utils/hooks/useFetchCurrentUser";


const useStyles = makeStyles((theme: any) =>
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

function chatSettings() {
  // peut etre creer une route vers les settings
  // (admins, mute, ban, changer le status de la room,... )
  console.log("clicked on settings icon");
}
  
  // BULLES DE MESSAGES
const customBubble = (props: any) => (
  <div className="imessage">
  <p className={`${props.message.id ? "from-them" : "from-me"}`}>{props.message.message}</p>
  </div>
);

function Chat(props: any) {
  const socket: Socket = props.socket;
  const classes = useStyles();
  const { user } = useFetchCurrentUser();
  const [room, setRoom] = useState<string>("0");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [rooms, setRooms] = useState<Array<number>>([]);

  // INITIALISATION DES CHANNELS ET REJOINDRE LE CHANNEL 0
  if (rooms.length === 0)
  {
    socket.emit("handle_connect_test");
    socket.emit("chat_get_room");
    socket.emit("chat_join_room", "0");
  }

  // SEND MESSAGE
  const sendMessage = () => {
	  console.log(user);
    socket.emit('chat_send_message', { message, room, user });
    let tmp = new Message({
      id: 0,
      message: message,
      senderName: "adidion"
    });
    setMessages([...messages,tmp])
    socket.emit("chat_get_room");
  };
  
  // JOIN A ROOM
  const joinRoom = () => {
    if (room !== "") {
      socket.emit("chat_join_room", room);
    }
  };

  // JOIN A CHANNEL VIA LE BOUTON
  const joinChannel = (room_number: number) => {
    setRoom(room_number.toString());
    socket.emit("chat_join_room", room_number.toString());
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

    function handleReceived(data:any) {
      setMessages([...messages,
        new Message({
          id: 1,
          message: data.body,
          senderName: "talker"
        }),
      ])
      socket.emit("chat_get_room");
    }

    function handleJoined(data:any) {
      if (room === "")
        setRoom("0");
      messages.splice(0, messages.length);
      setMessages([]);
      data.forEach(function(value: any, key: any) {
        messages.push(new Message({
          id: 1,
          message: data[key].body,
          senderName: "talker"
        }));
        setMessages([...messages]);
      });
    }

    function handleConnected(data:any) {
      if (room === "")
        socket.emit("chat_join_room", "0");
      rooms.splice(0, rooms.length);
      setRooms([]);
      data.forEach(function(value: any, key: any) {
        rooms.push(data[key].room_number);
        setRooms([...rooms]);
      });
    }

    function handleSetRoom(data:any) {
      rooms.splice(0, rooms.length);
        setRooms([]);
        data.forEach(function(value: any, key: any) {
          rooms.push(data[key].room_number);
          setRooms([...rooms]);
        });
      }

    // RECEPTION DE MESSAGES
    socket.on("chat_receive_message", (data: any) => {
      handleReceived(data);
    });

    // JOIN ROOM
    socket.on("chat_joined_room", (data: any) => {
      handleJoined(data);
    });

    //CONNECTION DU CLIENT
    socket.on("chat_connected", (data: any) => {
      handleConnected(data);
    });

    socket.on("chat_set_rooms", (data: any) => {
      handleSetRoom(data);
      
    })

    return () => {
			socket.off();
		}
  // eslint-disable-next-line
  }, [message, messages, room, rooms])
  
  // RESET THE FORM
  function reset() {
    (document.getElementById("textareaInput") as HTMLFormElement).reset();
    setMessage('');
    
  }
  
  const loadChannels = rooms.map((room_number: number) => {
    return (
      <Button  sx={{mt:0.5}} variant="contained" size="large" fullWidth={true} key={room_number} onClick={() =>joinChannel(room_number)}>
        {room_number}
      </Button>
    )
  })

  // RETURN TO RENDER
  return (
  <>
    {/* colonnes */}
    <div className="columns">
      {/* colonne de gauche */}
      <div className="col1">
        <Paper className={classes.paper}>
          {/* affichage des channels dispo et creation d un bouton / room */}
          <>
            { loadChannels }
          </>
          {/* form de creation de room */}
          <TextField
            fullWidth={true}
            placeholder="Room Number..."
            onChange={(event: any) => {
              setRoom(event.target.value);
            }}
          />
          {/* bouton pour creer la room */}
          <Button onClick={joinRoom} fullWidth={true} variant="contained" size="large"> Create Room</Button>
        </Paper>
      </div>
      {/* colonne de droite */}
      <div className="col2">
        <Paper className={classes.paper2}>
          {/* papier pour l historique des messages */}
          <Paper id="style-1" className={classes.messagesBody}>
            {/* gestion de l'historique des messages */}
            <ChatFeed
              messages={messages} // Boolean: list of message objects
              isTyping={false} // Boolean: is the recipient typing
              hasInputField={false} // Boolean: use our input, or use your own
              showSenderName={true} // show the name of the user who sent the message
              bubblesCentered={true} //Boolean should the bubbles be centered in the feed?
              chatBubble={true && customBubble} // JSON: Custom bubble styles
            />
            <SettingsApplicationsIcon fontSize="large" className={classes.settings}/>
            <button className={classes.buttonSettings} onClick={chatSettings}/>
          </Paper>
          <>
            {/* formulaire pour envoyer un message */}
            <form className={classes.wrapForm}  noValidate autoComplete="off" id="textareaInput">
              <TextField
                placeholder='type your message'
                onChange={(event: any) => {
                  setMessage(event.target.value);
                }}
                // si on presse enter, le message s'envoit et le formulaire se vide
                onKeyDown={(event: any) => {
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
              {/* bouton d'envoi de messages */}
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

export default Chat;
