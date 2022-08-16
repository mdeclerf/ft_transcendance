import React from "react";
import { Typography } from '@mui/material';
import { getLeaderBoard } from "../utils/api";
import { Game } from "../utils/types";

export const LeaderBoard = () => {

     let test : Game[] = getLeaderBoard();
     console.log(test);
	return (
       <div>
            <Typography>Leaderboard</Typography>
            
       </div>
	)
}
