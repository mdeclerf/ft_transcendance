import { useFetchLeader } from "../utils/hooks/useFetchLeaderBoard";
import { Avatar, Box, Grid, List, ListItem, ListItemText, ListItemAvatar} from "@mui/material/";
import { User, Ranking } from "../utils/types";
import { Link } from 'react-router-dom';

export interface IBoardProps {
	user: User | undefined;
}

export const LeaderBoard = (props: IBoardProps) => {

     const { user } = props;
     let leader : Ranking[] | undefined = useFetchLeader().Response;

     leader?.sort((a, b) => {
          return b.ratio - a.ratio;
      });

     let backHeight: number;
	if (leader)
		backHeight = leader.length * 80;
	else
		backHeight = 80;

     const getRanking = (player: User, ratio : number, victories: number, losses: number, i: number) => {
          let path = `/user/${player.username}`;
		return (
			<ListItem
               button component={Link} to={path}
			key={i}
			sx={{
				alignItems: 'center',
				borderRadius: '10px',
                    backgroundColor: (player.username === user?.username) ? '#49c860' : '#E6EEE8',
				marginTop: '2px',
			}}
			>
                    <ListItemAvatar>
                         <Avatar
                              alt={player.username}
                              src={player.photoURL}
                              sx={{
                                   minWidth: { xs: 50 },
                                   minHeight: { xs: 50 }
                              }}
					/>
                    </ListItemAvatar>

				<ListItemText
					sx={{ fontFamily: 'Work Sans, sans-serif', fontSize: 70, color: 'black'}}
					primary={`${player.username} 
                         | Win ratio: ${Math.round(ratio * 100) / 100}
                         | Wins: ${victories}
                         | Losses: ${losses}`}
				/>
			</ListItem>
		)
	}

     const generate = () => {
          return leader?.map((item, i) => {
			return getRanking(item.user, item.ratio, item.victories, item.losses, i);
		})
     }

	return (
       <div>
          <Box
               sx={{
                    
                    width: 600,
                    height: {backHeight},
                    padding: '2%',
                    backgroundColor: 'primary.main',
                    borderRadius: '20px',
               }}
          >
               <Grid item xs='auto'>
                    <List>
                         {generate()}
                    </List>
               </Grid>
          </Box>
     </div>
	)
}