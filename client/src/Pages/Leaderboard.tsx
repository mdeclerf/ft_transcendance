import { useFetchLeader } from "../utils/hooks/useFetchLeaderBoard";
import { Box, Grid, List, ListItem, ListItemText} from "@mui/material/";
import { User } from "../utils/types";

export interface IBoardProps {
	user: User | undefined;
}

export const LeaderBoard = (props: IBoardProps) => {

     const { user } = props;
     let leader = useFetchLeader().Response;
     
     leader?.sort((a, b) => {
          return b.victories - a.victories;
      });

     let backHeight: number;
	if (leader)
		backHeight = leader.length * 80;
	else
		backHeight = 80;

     const getRanking = (username: string, victories : number, i: number) => {
		return (
			<ListItem
			key={i}
			sx={{
				alignItems: 'center',
				borderRadius: '10px',
                    backgroundColor: (username === user?.username) ? '#49c860' : '#E6EEE8',
				marginTop: '2px',
			}}
			>
				<ListItemText
					sx={{ fontFamily: 'Work Sans, sans-serif', fontSize: 70, color: 'black'}}
					primary={`Player: ${username} | Number of matches won: ${victories}`}
				/>
			</ListItem>
		)
	}

     const generate = () => {
          return leader?.map((item, i) => {
				return getRanking(item.username, item.victories, i);
		})
     }

	return (
       <div>
          <Box
               sx={{
                    
                    width: 800,
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
