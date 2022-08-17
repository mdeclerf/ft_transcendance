import React from "react";
import { Typography } from '@mui/material';
import { useFetchLeader } from "../utils/hooks/useFetchLeaderBoard";
import { getLeaderBoard } from "../utils/api";
import axios, { AxiosRequestConfig } from "axios/";

export const LeaderBoard = () => {

     // const CONFIG: AxiosRequestConfig = { withCredentials: true };
     
     // axios.get<Map<string, number>>('http://localhost:3001/api/user/leaderboard', CONFIG)
     // .then(({data}) => {
          //      console.log(data);
          // })
          
          // let Map : Map<string, number> = await getLeaderBoard();
          
     let leader  = useFetchLeader();
     // for (let value of leader.values)
	// {

	return (
       <div>
            <Typography>Leaderboard</Typography>
            
       </div>
	)
}
