import { Box, CircularProgress, FormGroup, Button, Tab, Tabs, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import * as React from 'react';
import { CenteredDiv } from '../utils/styles';
import { Message, MessageGroup, Room, User } from '../utils/types';
import { ChatMsg } from './ChatMsg';

interface ITabPanelProps {
	title: string;
	children?: React.ReactNode;
	message: string;
	index: number;
	value: number;
	messageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	messageSend: (event: React.FormEvent) => void;
}

const TabPanel = (props: ITabPanelProps) => {
	const { title, message, children, value, index, messageChange, messageSend } = props;
	const formRef = React.useRef<HTMLFormElement>(null);

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			style={{ flexGrow: 1 }}
		>
			{value === index && (
				<Box sx={{ p: 3, minWidth: '80vw', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
					<Typography sx={{ flexGrow: 0 }}>{title}</Typography>
					<div style={{ flexGrow: 1, maxHeight: '80vh', overflowY: 'auto' }}>
						{children}
					</div>
					<form ref={formRef} onSubmit={messageSend} style={{ flexGrow: 0 }}>
						<FormGroup sx={{ display: 'flex', flexDirection: 'row'}}>
							<TextField sx={{ flexGrow: 1 }} onChange={messageChange} value={message}/>
							<Button type="submit" variant="outlined" >
								<SendIcon />
							</Button>
						</FormGroup>
					</form>
				</Box>
			)}
		</div>
	);
}

const a11yProps = (index: number) => {
	return {
		id: `vertical-tab-${index}`,
		'aria-controls': `vertical-tabpanel-${index}`,
	};
}

export interface IVerticalTabsProps {
	rooms: Room[];
	message: string;
	messages: Message[];
	currentUser: User;
	switchRooms: (room: Room) => void;
	messagesLoading: boolean;
	messageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	messageSend: (event: React.FormEvent) => void;
};

export const VerticalTabs = (props: IVerticalTabsProps) => {
	const { rooms, message, messages, currentUser, switchRooms, messagesLoading, messageChange, messageSend } = props;
	const [value, setValue] = React.useState(0);

	const mapChatBubbles = () => {
		if (messagesLoading) return <CenteredDiv><CircularProgress /></CenteredDiv>;

		const msgGrp: MessageGroup[] = [];
		for (let i = 0; i < messages.length; i++) {
			if (i === 0 || messages[i - 1].user.id !== messages[i].user.id) {
				msgGrp.push({ 
					side: (messages[i].user.id === currentUser.id) ? 'right' : 'left', 
					messages: [messages[i].body], 
					user: messages[i].user
				});
			} else {
				msgGrp[msgGrp.length - 1].messages.push(messages[i].body);
			}
		}

		return msgGrp.map((msg, i) => {
			return (
				<ChatMsg
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
				flexGrow: 2,
				display: 'flex',
			}}
		>
			<Tabs
				orientation='vertical'
				variant="scrollable"
				value={value}
				onChange={handleChange}
				aria-label="Chat channels"
				sx={{ borderRight: 1, borderColor: 'divider', maxWidth: '20vw', flexGrow: 1 }}
			>
				{rooms.map((room, i) => {
					return (
						<Tab label={room.name} key={i} {...a11yProps(i)} />
					)
				})}
			</Tabs>
			{rooms.map((room, i) => {
				return (
					<TabPanel
						title={room.name}
						value={value}
						index={i}
						key={i}
						messageChange={messageChange}
						messageSend={messageSend}
						message={message}
					>
						{mapChatBubbles()}
					</TabPanel>
				)
			})}
		</Box>
	)
}


