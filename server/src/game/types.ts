export class GameDetails{

	constructor() {
		this.login = "";
		this.mode = "";
		this.opponent_login = "";
		this.score = 0;
		this.opponent_score = 0;
		this.has_won = false;
	}

	public login: string;
	public mode: string;
	public opponent_login: string;
	public score: number;
	public opponent_score: number;
	public has_won: boolean;
}