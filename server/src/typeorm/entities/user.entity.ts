import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Chat, Game, ChatUser, Room } from "../";
import { Subscription } from "./subscription.entity";
import { Blocklist } from "../";

@Entity({ name: 'users' })
export class User {

	@PrimaryGeneratedColumn()
	public id!: number;

	@Column ({type: 'text', name: 'intra_id', unique: true})
	public intraId: string;

	@Column ({type: 'text'})
	public username: string;

	@Column({ default: 'offline' })
	status: 'online' | 'offline' | 'in_game';

	@Column ({type: 'text', name: 'display_name'})
	public displayName: string;

	@Column ({type: 'text', name: 'photo_url', nullable: true})
	public photoURL: string;

	@Column ({type: 'text', nullable: true, name: "two_factor_secret"})
	public twoFactorAuthenticationSecret: string;

	@Column ({default: false, name: "two_factor_enabled"})
	public isTwoFactorAuthenticationEnabled: boolean;

	@Column({ name: 'two_factor_authed', default: false })
	isSecondFactorAuthenticated: boolean;

	@OneToMany(() => Chat, (chat) => chat.user)
	chat: Chat[]

	@Column({name: 'socket_id', nullable: true})
	socketId: string;

	@OneToMany(() => ChatUser, (chat_user) => chat_user.user)
	chat_user: ChatUser[]

	@OneToMany(type => Subscription, subscription => subscription.subscriber)
	subscriptions: Subscription[];

	@OneToMany(type => Subscription, subscription => subscription.subscribedTo)
	subscribers: Subscription[];

	@OneToMany(type => Blocklist, blocklist => blocklist.blockee)
	blocking: Blocklist[];

	@OneToMany(type => Blocklist, blocklist => blocklist.blocker)
	blocked_by: Blocklist[];

	@OneToMany(() => Game, (game) => game.player_1)
	p1_game: Game[]

	@OneToMany(() => Game, (game) => game.player_2)
	p2_game: Game[]

}
