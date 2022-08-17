import axios, { AxiosRequestConfig } from "axios/";
import { User, UserResponse, Ranking} from "./types";

const CONFIG: AxiosRequestConfig = { withCredentials: true };
const QRCONFIG: AxiosRequestConfig = { withCredentials: true, responseType: 'blob' };

export const getAuthStatus = () => axios.get<User>('http://localhost:3001/api/auth/status', CONFIG);
export const getUser = (username: string | undefined) => axios.get<UserResponse>(`http://localhost:3001/api/user/${username}`, CONFIG);
export const getQRCode = () => axios.post<Blob>('http://localhost:3001/api/2fa/generate', '', QRCONFIG);
export const getLeaderBoard = () => axios.get<Ranking[]>('http://localhost:3001/api/user/leaderboard', CONFIG);
