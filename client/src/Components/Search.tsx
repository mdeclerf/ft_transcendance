import { Autocomplete, Avatar, Box, CircularProgress, createFilterOptions, IconButton, Paper, TextField } from '@mui/material';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import * as React from 'react';
import axios from 'axios';
import { AutoCompleteResult } from '../utils/types';

export interface ISearchBarProps {
}

export function SearchBar (props: ISearchBarProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [complete, setComplete] = useState<AutoCompleteResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const filterOptions = createFilterOptions({
		stringify: (option: AutoCompleteResult) => `${option.username} ${option.displayName}`
	});

	const handleClick = () => {
		if (searchQuery) window.location.href = `http://localhost:3000/user/${searchQuery}`;
	}

	const handleChange = (event: React.SyntheticEvent, value: string) => {
		setSearchQuery(value);
		if (value) {
			setLoading(true);
			axios.get(`http://localhost:3001/api/user/complete?q=${value}`, { withCredentials: true })
				.then(res => {
					setLoading(false);
					// console.log('data: ', res.data);
					setComplete(res.data);
				})
				.catch(err => {
					setLoading(false);
					if (err) throw err;
				});
		} else {
			setComplete([]);
		}
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter' && !isOpen) {
			// event.preventDefault();
			handleClick();
		}
	}

	return (
		<div>
			<Paper
				component="div"
				sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300 }}
			>
				<Autocomplete
					loading={loading}
					onInputChange={handleChange}
					fullWidth
					options={complete}
					onOpen={() => { setIsOpen(true) }}
					onClose={() => { setIsOpen(false) }}
					filterOptions={filterOptions}
					getOptionLabel={({ username }) => {
						return username;
					}}
					isOptionEqualToValue={(option: AutoCompleteResult, value: AutoCompleteResult) => {
						return option.username === value.username;
					}}
					filterSelectedOptions
					renderOption={(props, option: AutoCompleteResult) => (
						<Box component="li" sx={{ mr: 2, flexShrink: 0, gap: 1 }} {...props}>
							<Avatar
								src={option.photoURL}
								alt=""
							/>
							{option.username} ({option.displayName})
						</Box>
					)}
					renderInput={(params) => (
						<TextField 
							{...params} 
							label="Search users" 
							variant="filled" 
							size="small" 
							onKeyDown={handleKeyDown}
							InputProps={{
								...params.InputProps,
								endAdornment: (
									<>
										{loading ? <CircularProgress color="inherit" size={20} /> : null}
										{/* {params.InputProps.endAdornment} */}
									</>
								)
							}}
						/>
					)}
				/>
				<IconButton onClick={handleClick} sx={{ p: '10px' }} aria-label="search">
					<SearchIcon />
				</IconButton>
			</Paper>
		</div>
	);
}