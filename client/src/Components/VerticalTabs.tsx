import SendIcon from '@mui/icons-material/Send';
import { Avatar, AvatarGroup, Box, Button, Divider, Tab, Tabs, TextField, Tooltip, Typography } from '@mui/material';
import * as React from 'react';
import { subscribeToAutoSwitchRoom } from '../utils/socket_helpers';
import { Message, MessageGroup, Room, User } from '../utils/types';
import { ButtonCreateChannels } from './ButtonCreateChannels';
import { RoomSettings } from './RoomSettings';
import { ChatMsg } from './ChatMsg';
import LockIcon from '@mui/icons-material/Lock';
import { ButtonJoinChannel } from './ButtonJoinChannel';
import { useLocation } from 'react-router-dom';
import ThreePIcon from '@mui/icons-material/ThreeP';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

interface ITabPanelProps {
	mute: boolean;
	owner: boolean;
	title: string | undefined;
	children?: React.ReactNode;
	message: string;
	index: number;
	value: number;
	messageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	messageSend: () => void;
	roomUsers: User[];
	currentUser: User | undefined;
	isProtected: boolean;
	isPrivate: boolean;
	passAuthenticated: boolean;
}

const TabPanel = (props: ITabPanelProps) => {
	const { mute, owner, title, message, children, value, index, messageChange, messageSend, roomUsers, currentUser, isPrivate} = props; // isProtected, passAuthenticated
	const divRef = React.useRef<HTMLDivElement>(null);

	const handleInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			messageSend();
		}
	};

	React.useEffect(() => {
		if (divRef && divRef.current) {
			divRef.current.scrollTo(0, divRef.current.scrollHeight);
		}
	}, [children])

	const getFirstFourNonSelfUsers = () => {
		if (roomUsers.length) {
			const tmp = roomUsers.filter(user => user && currentUser && user.id !== currentUser.id).slice(0, 3);

			return tmp.map((user, i) => {
				return (
					<Tooltip title={user.username} key={i}>
						<Avatar alt={user.username} src={user.photoURL} key={i}/>
					</Tooltip>
				)
			})
		}
	}

	const getChatAndInput = () => {
		let defaultText;
		let disable;
		if (mute)
		{
			defaultText = "You are muted in this channel";
			disable = true;
		}
		else
		{
			defaultText = "";
			disable = false;
		}
		return (
			<>
				<div style={{ flexGrow: 1, maxHeight: '80vh', overflowY: 'auto' }} ref={divRef}>
					{children}
				</div>
				<form style={{ flexGrow: 0, display: 'flex', flexDirection: 'row' }}>
						<TextField sx={{ flexGrow: 1 }} disabled={disable} onChange={messageChange} placeholder={defaultText} value={message} onKeyDown={handleInput} autoComplete="off"/>
						<Button variant="outlined" onClick={messageSend}>
							<SendIcon />
						</Button>
				</form>
			</>
		)
	}

	return (
		<>
			<div
				role="tabpanel"
				hidden={value !== index}
				id={`vertical-tabpanel-${index}`}
				aria-labelledby={`vertical-tab-${index}`}
				style={{ flexGrow: 1 }}
			>
				{value === index && (
					<Box sx={{ p: 3, minWidth: '80vw', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
						<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
							<Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px'}}>
								<Typography sx={{ flexGrow: 0 }} variant="h4">{title}</Typography>
								{owner === true && (
									<RoomSettings room={title}/>
								)}
								{
									!isPrivate && (<Button variant="text" startIcon={<ExitToAppIcon />} size="small">Leave</Button>)
								}
							</Box>
							<AvatarGroup total={roomUsers.length}>
								{getFirstFourNonSelfUsers()}
							</AvatarGroup>
						</Box>
						<Divider />
						{getChatAndInput()}
					</Box>
				)}
			</div>
			{/* { (isProtected && !passAuthenticated && (value === index)) && (
				<PasswordDialog title={title} setPassAuthenticated={setPassAuthenticated} />
			)} */}
		</>
	);
}

const a11yProps = (index: number) => {
	return {
		id: `vertical-tab-${index}`,
		'aria-controls': `vertical-tabpanel-${index}`,
	};
}

export interface IVerticalTabsProps {
	mute: boolean;
	room: Room;
	admin: boolean;
	owner: boolean;
	rooms: Room[];
	message: string;
	messages: Message[];
	currentUser: User | undefined;
	switchRooms: (room: Room) => void;
	messagesLoading: boolean;
	messageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	messageSend: () => void;
	roomUsers: User[];
};

export const VerticalTabs = (props: IVerticalTabsProps) => {
	const location = useLocation();
	const { mute, room, admin, owner, rooms, message, messages, currentUser, switchRooms, messageChange, messageSend, roomUsers } = props;
	const [value, setValue] = React.useState(0);
	const [formattedMessages, setFormattedMessages] = React.useState<MessageGroup[]>([]);
	const [passAuthenticated, setPassAuthenticated] = React.useState(false);

	React.useEffect(() => {
		const msgGrp: MessageGroup[] = [];
		for (let i = 0; i < messages.length; i++) {
			if (i === 0 || messages[i - 1].user.id !== messages[i].user.id) {
				msgGrp.push({
					side: (messages[i].user.id === currentUser?.id) ? 'right' : 'left', 
					messages: [messages[i].body], 
					user: messages[i].user
				});
			} else {
				msgGrp[msgGrp.length - 1].messages.push(messages[i].body);
			}
		}

		setFormattedMessages([]);
		setFormattedMessages(msgGrp);
	}, [messages, currentUser?.id]);

	React.useEffect(() => {
		if (location.hash !== '') {
			const hash = location.hash.slice(1);
			switchRooms({ name: hash, type: 'private'});
			const index = rooms.map((room) => { return (room.name) }).indexOf(hash);
			setValue(index);
		}
	// eslint-disable-next-line
	}, [location.hash, rooms])

	React.useEffect(() => {
		subscribeToAutoSwitchRoom((data) => {
			setValue(data);
		})
	}, [])

	const mapChatBubbles = () => {
		return formattedMessages.map((msg, i) => {
			return (
				<ChatMsg
					room={room}
					admin={admin}
					owner={owner}
					user={msg.side === 'left' ? msg.user : undefined}
					messages={msg.messages}
					side={msg.side}
					key={i}
				/>
			)
		});
	}

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		switchRooms(rooms[newValue]);
		setValue(newValue);
	};

	return (
		<Box
			sx={{
				bgColor: 'background.paper',
				flexGrow: 1,
				maxHeight: 'calc(100vh - 64px)',
				display: 'flex',
				overflow: 'hidden',
			}}
		>
			<Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '2px' }}>
				<ButtonCreateChannels currentUser={currentUser} switchRooms={switchRooms}/>
				<ButtonJoinChannel setPassAuthenticated={setPassAuthenticated} />
				<Tabs
					orientation='vertical'
					variant="scrollable"
					value={value}
					onChange={handleChange}
					aria-label="Chat channels"
					sx={{ borderRight: 1, borderColor: 'divider', maxWidth: '20vw', flexGrow: 1 }}
				>
					{rooms.map((room, i) => {
						if (room.type === 'protected') {
							return (
								<Tab label={room.name} key={i} iconPosition='start' icon={<LockIcon />} {...a11yProps(i)} />
							)
						} 
						else if (room.type === 'private'){
							return (
								<Tab label={room?.DM_user || ''} key={i} iconPosition='start' icon={<ThreePIcon />} {...a11yProps(i)} />
							)
						}
						else {
							return (
								<Tab label={room.name} key={i} {...a11yProps(i)} />
							)
						}
					})}
				</Tabs>
			</Box>
			{rooms.map((room, i) => {
				return (
					<TabPanel
						mute={mute}
						owner={owner}
						title={room.type === "private" ? room.DM_user : room.name}
						value={value}
						index={i}
						key={i}
						messageChange={messageChange}
						messageSend={messageSend}
						message={message}
						roomUsers={roomUsers}
						currentUser={currentUser}
						isProtected={room.type === 'protected'}
						isPrivate={room.type === 'private'}
						passAuthenticated={passAuthenticated}
					>
						{mapChatBubbles()}
					</TabPanel>
				)
			})}
		</Box>
	)
}


