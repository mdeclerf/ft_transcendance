import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { GameService } from '../typeorm/game/game.service';
import { GameDetails } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';

let details: GameDetails = new GameDetails;

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

	constructor(id: string, socket: Socket) {
		this.y_pos = 0;
		this.delta = 0;
		this.id = id;
		this.score = 0;
		this.socket = socket;
	}
}

class Pong{
	private logger: Logger = new Logger('GameGateway');
	is_running: boolean = false;
	is_over: boolean = false;
	key: string;
	first_player: Player = null;
	second_player: Player = null;
	ball_x: number = 350;
	ball_y: number = 250;
	ball_angle: number = random_ball();
	spectator: Player[] = [];
	winning_score: number = 6;
	ball_speed: number = 12;
	mode: string = "";
	removed: boolean = false;

	constructor(private gameService: GameService, unique_id:string, mode:string) {
		this.key = unique_id;
		this.mode = mode;
	}

	change_position(player: Player) {
		player.y_pos += player.delta * 10;
		if (player.y_pos < 10) {
			player.y_pos = 10;
		} else if (player.y_pos > 430) {
			player.y_pos = 430;
		}
	}

	touch_player(player: Player): boolean {
		const x: number = player == this.first_player ? 5 : 670;

		return (this.ball_x >= x && this.ball_x <= x + 20) && (this.ball_y >= player.y_pos && this.ball_y <= player.y_pos + 70);
	}

	change_ball_pos(player_1: Player, player_2: Player) {
		this.ball_x += this.ball_speed * Math.cos(this.ball_angle);
		this.ball_y += this.ball_speed * Math.sin(this.ball_angle);
		if (this.ball_x > 700) {
			player_1.score += 1;
			this.ball_x = 350;
			this.ball_y = 250;
			this.ball_angle = random_ball();
		} else if (this.ball_x < 0) {
			player_2.score += 1;
			this.ball_x = 350;
			this.ball_y = 250;
			this.ball_angle = random_ball();
		}
		if (this.ball_y >= 495) {
			this.ball_angle = -this.ball_angle;
		} else if (this.ball_y <= 5) {
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

	end_of_game() {
	}
	
	async run_game() {
		this.ball_angle = random_ball();
		while (this.is_running) {
			this.change_ball_pos(this.first_player, this.second_player);
			this.change_position(this.first_player);
			this.change_position(this.second_player);
			this.first_player.socket.emit("getPosition", `${this.first_player.y_pos} ${this.second_player.y_pos} ${this.ball_x} ${this.ball_y} ${this.first_player.score} ${this.second_player.score}`);
			this.second_player.socket.emit("getPosition", `${this.second_player.y_pos} ${this.first_player.y_pos} ${700 - this.ball_x} ${this.ball_y} ${this.first_player.score} ${this.second_player.score} `);
			for (let index = 0; index < this.spectator.length; index++) {
				this.spectator[index].socket.emit("getPosition", `${this.second_player.y_pos} ${this.first_player.y_pos} ${700 - this.ball_x} ${this.ball_y} ${this.first_player.score} ${this.second_player.score} `);
			}

			if ((this.first_player && this.second_player && (this.first_player.score >= this.winning_score) || this.second_player.score >= this.winning_score))
			{
				this.is_running = false;
				this.first_player.socket.emit("running", "false");
				this.second_player.socket.emit("running", "false");
				this.first_player.socket.emit("getPosition", `${this.first_player.y_pos} ${this.second_player.y_pos} ${this.ball_x} ${this.ball_y} ${this.first_player.score} ${this.second_player.score}`);
				this.second_player.socket.emit("getPosition", `${this.second_player.y_pos} ${this.first_player.y_pos} ${700 - this.ball_x} ${this.ball_y} ${this.first_player.score} ${this.second_player.score} `);
				this.database_create(this.first_player.id);
				this.database_create(this.second_player.id);

				if (this.mode === "chat")
				{
					this.first_player.socket.emit("replay", "");
					this.second_player.socket.emit("replay", "");
				}
				else
					this.is_over = true;
			}
			await sleep(50);
		}
	}

	add_player(p: Player) {
			if (this.first_player == null) {
				this.first_player = p;
				this.first_player.socket.emit("players", "First player");
				this.first_player.socket.emit("winning_score", this.winning_score.toString());
			}

			else if (this.second_player == null) {
				this.second_player = p;
				this.second_player.socket.emit("players", "Second player");
				this.second_player.socket.emit("winning_score", this.winning_score.toString());
				this.is_running = true;
				this.ball_x = 350;
				this.ball_y = 250;
				this.run_game();
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

	set_details(id: string)
	{
		if (this.first_player && this.first_player.id == id)
		{
			details.mode = this.mode
			details.socket_id = this.first_player.id;
			details.socket_id_opponent = this.second_player.id;
			details.score = this.first_player.score;
			details.score_opponent = this.second_player.score;
			if (this.first_player.score >= this.winning_score)
			details.has_won = true;
			else if (this.second_player.score >= this.winning_score)
			details.has_won = false;
		}

		else if (this.second_player && this.second_player.id == id)
		{
			details.mode = this.mode
			details.socket_id = this.second_player.id;
			details.socket_id_opponent = this.first_player.id;
			details.score = this.second_player.score;
			details.score_opponent = this.first_player.score;
			if (this.second_player.score >= this.winning_score)
			details.has_won = true;
			else if (this.first_player.score >= this.winning_score)
			details.has_won = false;
		}
	}

	async database_create(id: string): Promise<void> {
		this.set_details(id);
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
	private logger: Logger = new Logger('GameGateway');

	@SubscribeMessage("join_room")
	handleRoom(client: Socket, message: any) : void {
		client.join(message);

		if (!this.Game.has(message))
			this.Game.set(message, new Pong(this.gameService, message, "chat"));
		this.Game.get(message).add_player(new Player(client.id, client));
	}

	@SubscribeMessage("monitor")
	Monitor(client: Socket) : void {
		for(let value of this.Game.values())
		{
			if (value.is_over || (value.first_player === null && value.removed) || (value.second_player === null && value.removed))
			{
				client.emit("remove_ongoing_game", `${value.key}`);
				let tmp = value.key;
				this.Game.delete(tmp);
				continue;
			}
			else if (value.first_player && value.second_player)
				client.emit("add_ongoing_game", `${value.key}`);
		}
	}

	@SubscribeMessage("add_spectator")
	AddSpectator(client: Socket, message: any) : void {
		console.log(`Add spectator ${client.id}`);
		this.Game.get(message).add_player(new Player(client.id, client));
	}

	handleDisconnect(client: Socket) {
		for (let value of this.Game.values())
		{
			if ((value.first_player && client.id === value.first_player.id) || (value.second_player && client.id === value.second_player.id)) {
				value.remove_player(client.id);
				break;
			}

			if (value.spectator.length > 0)
			{
				for(let j = 0; j <= value.spectator.length; j++) 
				{
					if (value.spectator[j])
					{
						if (client.id === value.spectator[j].id)
						{
							value.remove_spectator(client.id);
							break;
						}
					}
				}
			}
		}
	}

	@SubscribeMessage('setPosition')
	handleMessage(client: Socket, message: string): void {
		if (message[1] == 'd') {
			this.Game.get(message[0]).set_delta(1, client.id);
		} else if (message[1] == 'u') {
			this.Game.get(message[0]).set_delta(-1, client.id);
		} else if (message[1] == 'o') {
			this.Game.get(message[0]).set_delta(0, client.id);
		}
	}

	@SubscribeMessage('play_again')
	handleReplay(client: Socket, message: string) : void {
		if (!JSON.stringify(message[1]).includes("Watching") && !this.Game.get(message[0]).is_running)
		{
			this.Game.get(message[0]).is_running = true;
			this.Game.get(message[0]).first_player.score = 0;
			this.Game.get(message[0]).second_player.score = 0;
			this.Game.get(message[0]).run_game();
		}
	}

	@SubscribeMessage('add_to_queue')
	add_queue(client: Socket) : void {

		this.queue.push(new Player(client.id, client));

		if (this.queue.length >= 2)
		{
			const unique_id = uuidv4();
			this.Game.set(unique_id, new Pong(this.gameService, unique_id, "normal"));
			this.Game.get(unique_id).add_player(new Player(this.queue[0].id, this.queue[0].socket));
			this.queue.splice(0,1);
			this.Game.get(unique_id).add_player(new Player(this.queue[0].id, this.queue[0].socket));
			this.queue.splice(0,1);
			this.Game.get(unique_id).first_player.socket.emit("assigned_room", unique_id);
			this.Game.get(unique_id).second_player.socket.emit("assigned_room", unique_id);
			this.Game.get(unique_id).first_player.socket.emit("running", "true");
			this.Game.get(unique_id).second_player.socket.emit("running", "true");
		}
	}
}
