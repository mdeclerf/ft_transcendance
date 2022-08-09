import { Box, Tab, Tabs, Typography } from '@mui/material';
import * as React from 'react';
import { Message, MessageGroup } from '../utils/types';
import { ChatMsg } from './ChatMsg';

interface ITabPanelProps {
	title: string;
	children?: React.ReactNode;
	index: number;
	value: number;
}

const TabPanel = (props: ITabPanelProps) => {
	const { title, children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3, minWidth: '80vw' }}>
					<Typography>{title}</Typography>
					{children}
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
	channels: string[];
	messages: Message[];
};

export const VerticalTabs = (props: IVerticalTabsProps) => {
	const { channels, messages } = props;
	const [value, setValue] = React.useState(0);

	const mapChatBubbles = () => {
		const msgGrp: MessageGroup[] = [];
		for (let i = 0; i < messages.length; i++) {
			if (i === 0 || messages[i - 1].sender.id !== messages[i].sender.id) {
				msgGrp.push({ side: messages[i].side, messages: [messages[i].message], sender: messages[i].sender});
			} else {
				msgGrp[msgGrp.length - 1].messages.push(messages[i].message);
			}
		}

		return msgGrp.map((msg) => {
			return (
				<ChatMsg
					avatar={msg.side === 'left' ? msg.sender.photoURL : ''}
					messages={msg.messages}
					side={msg.side}
				/>
			)
		})
	}

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Box
			sx={{
				bgColor: 'background.paper',
				display: 'flex',
				alignItems: 'flex-end',
			}}
		>
			<Tabs
				orientation='vertical'
				variant="scrollable"
				value={value}
				onChange={handleChange}
				aria-label="Chat channels"
				sx={{ borderRight: 1, borderColor: 'divider', maxWidth: '20vw' }}
			>
				{channels.map((channel, i) => {
					return (
						<Tab label={channel} key={i} {...a11yProps(i)} />
					)
				})}
			</Tabs>
			{channels.map((channel, i) => {
				return (
					<TabPanel title={channel} value={value} index={i} key={i}>
						{mapChatBubbles()}
					</TabPanel>
				)
			})}
		</Box>
	)
}


