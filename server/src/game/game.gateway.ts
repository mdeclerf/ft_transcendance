import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { GameService } from './game.service';
import { GameDetails } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';
import { UserDetails } from "../utils/types";

let details: GameDetails = new GameDetails;
const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 700;
const PADDLE_HEIGHT = 60;
const PADDLE_MARGIN = 10;
const PADDLE_WIDTH = 10;
const BALL_SIDE = 10;

const sleep = (milliseconds: number) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function getRandomInt(max: number) {
	return Math.floor(Math.random() * max);
}

const random_ball = () => {
	return Math.random() * Math.PI / 2 - Math.PI / 4 + getRandomInt(2) * Math.PI;
}

class Player {

	y_pos: number;
	delta: number;
	id: string;
	score: number;
	socket: Socket;
	userDetails: UserDetails;

	constructor(id: string, socket: Socket, userDetails: UserDetails) {
		this.y_pos = 0;
		this.delta = 0;
		this.id = id;
		this.score = 0;
		this.socket = socket;
		this.userDetails = userDetails;
	}
}

class Pong{
	private logger: Logger = new Logger('GameGateway');
	is_running: boolean = false;
	is_over: boolean = false;
	key: string;
	first_player: Player = null;
	second_player: Player = null;
	ball_x: number = CANVAS_WIDTH / 2;
	ball_y: number = CANVAS_HEIGHT / 2;
	ball_angle: number = random_ball();
	spectator: Player[] = [];
	winning_score: number = 4;
	ball_speed: number = 12;
	mode: string = "";
	removed: boolean = false;

	constructor(private gameService: GameService, unique_id:string, mode:string) {
		this.key = unique_id;
		this.mode = mode;
	}

	change_position(player: Player) {
		player.y_pos += player.delta * 10;
		if (player.y_pos < PADDLE_MARGIN) {
			player.y_pos = PADDLE_MARGIN;
		} else if (player.y_pos > CANVAS_HEIGHT - PADDLE_HEIGHT - PADDLE_MARGIN) {
			player.y_pos = CANVAS_HEIGHT - PADDLE_HEIGHT - PADDLE_MARGIN;
		}
	}

	// touch_player(player: Player): boolean {
	// 	let x: number = player == this.first_player ? PADDLE_MARGIN + PADDLE_WIDTH : CANVAS_WIDTH - PADDLE_WIDTH - PADDLE_MARGIN;
	// 	const d: number = this.ball_angle + Math.PI;
	// 	if ((this.first_player == player && (d > Math.PI / 2 && d < Math.PI / 2 * 3)) || (this.second_player == player && !(d > Math.PI / 2 && d < Math.PI / 2 * 3)) )
	// 		return (false);
	// 	return ((this.first_player == player && this.ball_x <= x) || (this.second_player == player && this.ball_x >= x))
	// 	&& (this.ball_y >= player.y_pos && this.ball_y <= player.y_pos + PADDLE_HEIGHT + BALL_SIDE);
	// }

	touch_player(player: Player): boolean {
		const x: number = player == this.first_player ? 5 : 670;
		const d: number = this.ball_angle + Math.PI;
		if ((this.first_player == player && (d > Math.PI / 2 && d < Math.PI / 2 * 3)) || (this.second_player == player && !(d > Math.PI / 2 && d < Math.PI / 2 * 3)) )
			return (false);
		return (this.ball_x >= x && this.ball_x <= x + 20) && (this.ball_y >= player.y_pos && this.ball_y <= player.y_pos + 70);
	}

	change_ball_pos(player_1: Player, player_2: Player) {
		this.ball_x += this.ball_speed * Math.cos(this.ball_angle);
		this.ball_y += this.ball_speed * Math.sin(this.ball_angle);
		if (this.ball_x > CANVAS_WIDTH) {
			player_1.score += 1;
			this.ball_x = CANVAS_WIDTH / 2;
			this.ball_y = CANVAS_HEIGHT / 2;
			this.ball_angle = random_ball();
		} else if (this.ball_x < 0) {
			player_2.score += 1;
			this.ball_x = CANVAS_WIDTH / 2;
			this.ball_y = CANVAS_HEIGHT / 2;
			this.ball_angle = random_ball();
		}
		if (this.ball_y >= CANVAS_HEIGHT - (BALL_SIDE / 2)) {
			this.ball_angle = -this.ball_angle;
		} else if (this.ball_y <= BALL_SIDE / 2) {
			this.ball_angle = -this.ball_angle;
		}
		if (this.touch_player(this.first_player)) {
			this.ball_angle = Math.PI - this.ball_angle;
		}
		if (this.touch_player(this.second_player)) {
			this.ball_angle = Math.PI - this.ball_angle;
		}
	}

	set_delta(delta: number, id: string) {
		if (this.first_player && this.first_player.id == id) {
			this.first_player.delta = delta;
		} else if (this.second_player && this.second_player.id == id) {
			this.second_player.delta = delta;
		}
	}

	async run_game() {
		this.ball_angle = random_ball();
		while (this.is_running) {
			this.change_ball_pos(this.first_player, this.second_player);
			this.change_position(this.first_player);
			this.change_position(this.second_player);
			this.first_player.socket.emit("getPosition", `${this.first_player.y_pos} ${this.second_player.y_pos} ${this.ball_x} ${this.ball_y} ${this.first_player.score} ${this.second_player.score}`);
			this.second_player.socket.emit("getPosition", `${this.second_player.y_pos} ${this.first_player.y_pos} ${CANVAS_WIDTH - this.ball_x} ${this.ball_y} ${this.first_player.score} ${this.second_player.score} `);
			for (let index = 0; index < this.spectator.length; index++) {
				this.spectator[index].socket.emit("getPosition", `${this.second_player.y_pos} ${this.first_player.y_pos} ${CANVAS_WIDTH - this.ball_x} ${this.ball_y} ${this.first_player.score} ${this.second_player.score} `);
			}

			if ((this.is_running && this.first_player && this.second_player && (this.first_player.score >= this.winning_score) || this.second_player.score >= this.winning_score))
			{
				this.is_running = false;
				this.first_player.socket.emit("running", "false");
				this.second_player.socket.emit("running", "false");
				this.first_player.socket.emit("getPosition", `${this.first_player.y_pos} ${this.second_player.y_pos} ${this.ball_x} ${this.ball_y} ${this.first_player.score} ${this.second_player.score}`);
				this.second_player.socket.emit("getPosition", `${this.second_player.y_pos} ${this.first_player.y_pos} ${CANVAS_WIDTH - this.ball_x} ${this.ball_y} ${this.first_player.score} ${this.second_player.score} `);
				this.database_create(this.first_player.id, this.second_player.id);

				this.is_over = true;
			}
			await sleep(50);
		}
	}

	add_player(p: Player) {
			if (this.first_player == null) {
				this.first_player = p;
				console.log(` First player : ${this.first_player.userDetails.username}, ${this.first_player.userDetails.displayName}, ${this.first_player.userDetails.intraId}, ${this.first_player.userDetails.photoURL}`);
				this.first_player.socket.emit("players", "First player");
				this.first_player.socket.emit("winning_score", this.winning_score.toString());
			}

			else if (this.second_player == null) {
				this.second_player = p;
				console.log(` Second player : ${this.second_player.userDetails.username}, ${this.second_player.userDetails.displayName}, ${this.second_player.userDetails.intraId}, ${this.second_player.userDetails.photoURL}`);
				this.second_player.socket.emit("players", "Second player");
				this.second_player.socket.emit("winning_score", this.winning_score.toString());
				this.first_player.socket.emit("opponent_login", this.second_player.userDetails.username);
				this.second_player.socket.emit("opponent_login", this.first_player.userDetails.username);
				this.is_running = true;
				this.ball_x = CANVAS_WIDTH / 2;
				this.ball_y = CANVAS_HEIGHT / 2;
				this.run_game();
				this.first_player.socket.emit("running", "true");
				this.second_player.socket.emit("running", "true");
			}

			else {
				this.spectator.push(p);
				p.socket.emit("players", "Watching");
				p.socket.emit("winning_score", this.winning_score.toString());
			}
	}

	remove_player(id: string) {
		if (this.first_player && this.first_player.id == id) {
			this.first_player = null;
			this.is_running = false;
			this.removed = true;
			if (this.second_player)
				this.second_player.socket.emit("disconnection", "");
		}
		else if (this.second_player && this.second_player.id == id) {
			this.second_player = null;
			this.is_running = false;
			this.removed = true;
			if (this.first_player)
				this.first_player.socket.emit("disconnection", "");
		}
		else {
			for (let index = 0; index < this.spectator.length; index++) {
				const element: Player = this.spectator[index];
				if (element.id == id) {
					this.spectator.splice(index, 1);
					break;
				}
			}
		}
	}

	remove_spectator(id: string) {
		for (let index = 0; index < this.spectator.length; index++) {
			const element: Player = this.spectator[index];
			if (element.id == id) {
				this.spectator.splice(index, 1);
				break;
			}
		}
	}

	set_details(p1_id: string, p2_id: string)
	{
		if ((this.first_player && this.first_player.id == p1_id) && (this.second_player && this.second_player.id == p2_id))
		{
			details.player_1 = this.first_player.userDetails;
			details.player_2 = this.second_player.userDetails;
			details.player_1_score = this.first_player.score;
			details.player_2_score = this.second_player.score;
			if (this.mode === "play")
				details.mode = "normal"
			else if (this.mode === "chat")
				details.mode = "invitation";
		}
	}

	async database_create(p1_id: string, p2_id): Promise<void> {
		this.set_details(p1_id, p2_id);
		await this.gameService.createUser(details);
	}
}

////////////////////////////////////////////////////////////////

@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayDisconnect {

	constructor(private gameService: GameService) {}
	@WebSocketServer() wss: Server;

	Game: Map<string, Pong> = new Map();
	queue: Player[] = [];

	@SubscribeMessage("join_room")
	handleRoom(client: Socket, message: UserDetails) : void {
		client.join(message[0]);

		if (!this.Game.has(message[0]))
			this.Game.set(message[0], new Pong(this.gameService, message[0], "chat"));
		this.Game.get(message[0]).add_player(new Player(client.id, client, message[1]));
	}

	@SubscribeMessage("kill_game")
	Kill_room(client: Socket, message:string) : void {
		this.Game.delete(message);
		this.wss.sockets.emit("remove_ongoing_game", message);
	}

	@SubscribeMessage("add_spectator")
	AddSpectator(client: Socket, message: any) : void {
		if (this.Game.has(message[0]))
			this.Game.get(message[0]).add_player(new Player(client.id, client, message[1]));
	}

	@SubscribeMessage("remove_spectator")
	RemoveSpectator(client: Socket, message: any) : void {
		if (this.Game.has(message))
			this.Game.get(message).remove_spectator(client.id);
	}

	handleDisconnect(client: Socket) {
		for (let value of this.Game.values())
		{
			if ((value.first_player && client.id === value.first_player.id) || (value.second_player && client.id === value.second_player.id)) {
			
				value.remove_player(client.id);
				for(let i = 0; i < value.spectator.length; i++)
					value.spectator[i].socket.emit("disconnection_of_player", value.key);
				break;
			}
		}
	}

	@SubscribeMessage('setPosition')
	handleMessage(client: Socket, message: string): void {
		if (this.Game.has(message[0]))
		{
			if (message[1] == 'd' && this.Game.get(message[0]).first_player && this.Game.get(message[0]).second_player) {
				this.Game.get(message[0]).set_delta(1, client.id);
			} else if (message[1] == 'u' && this.Game.get(message[0]).first_player && this.Game.get(message[0]).second_player) {
				this.Game.get(message[0]).set_delta(-1, client.id);
			} else if (message[1] == 'o' && this.Game.get(message[0]).first_player && this.Game.get(message[0]).second_player) {
				this.Game.get(message[0]).set_delta(0, client.id);
			}
		}
	}

	@SubscribeMessage('add_to_queue')
	add_queue(client: Socket, message: UserDetails) : void {
		this.queue.push(new Player(client.id, client, message));

		if (this.queue.length >= 2)
		{
			const unique_id = uuidv4();
			this.Game.set(unique_id, new Pong(this.gameService, unique_id, "play"));
			this.Game.get(unique_id).add_player(new Player(this.queue[0].id, this.queue[0].socket, this.queue[0].userDetails));
			this.queue.splice(0,1);
			this.Game.get(unique_id).add_player(new Player(this.queue[0].id, this.queue[0].socket, this.queue[0].userDetails));
			this.queue.splice(0,1);
			this.Game.get(unique_id).first_player.socket.emit("assigned_room", unique_id);
			this.Game.get(unique_id).second_player.socket.emit("assigned_room", unique_id);
			this.wss.sockets.emit("add_ongoing_game", [this.Game.get(unique_id).key, this.Game.get(unique_id).first_player.userDetails.username, this.Game.get(unique_id).second_player.userDetails.username]);
		}
	}

	@SubscribeMessage('remove_from_queue')
	removefromQueue(client: Socket, message: UserDetails) : void {
		for (let i = 0; i < this.queue.length; i++)
		{
			if (message.username === this.queue[i].userDetails.username)
			{
				// console.log(`removed from queue --> ${this.queue[i].userDetails.username}`);
				this.queue.splice(i,1);
			}
		}
	}

	@SubscribeMessage('remove_from_game')
	removefromGame(client: Socket) : void {
		for (let value of this.Game.values())
		{
			if ((value.first_player && client.id === value.first_player.id) || (value.second_player && client.id === value.second_player.id)) {
			
				value.remove_player(client.id);
				for(let i = 0; i < value.spectator.length; i++)
					value.spectator[i].socket.emit("disconnection_of_player", value.key);
				break;
			}
		}
	}

	@SubscribeMessage('get_current_games')
	getCurrentGames(client: Socket) : void {
		for (let value of this.Game.values())
			client.emit("current_games_list", [value.key, value.first_player.userDetails.username, value.second_player.userDetails.username]);
	}
}