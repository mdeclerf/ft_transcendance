import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Chat, ChatUser, Friendlist, Game, Block } from "../typeorm.module";

@Entity({ name: 'users' })
export class User {

	@PrimaryGeneratedColumn()
	public id!: number;

	@Column ({type: 'text', name: 'intra_id', unique: true})
	public intraId: string;

	@Column ({type: 'text'})
	public username: string;

	@Column ({type: 'text', name: 'display_name'})
	public displayName: string;

	@Column ({type: 'text', name: 'photo_url', nullable: true})
	public photoURL: string;

	@Column ({type: 'text', nullable: true})
	public twoFactorAuthenticationSecret: string;

	@Column ({default: false})
	public isTwoFactorAuthenticationEnabled: boolean;

	@OneToMany(() => Chat, (chat) => chat.user)
	chat: Chat[]

	@OneToMany(() => ChatUser, (chat_user) => chat_user.user)
	chat_user: ChatUser[]

	@OneToMany(() => Friendlist, (friendlist) => friendlist.user)
	friendlist: Friendlist[]

	@OneToMany(() => Friendlist, (friendlist) => friendlist.friend)
	friendof: Friendlist[]

	@OneToMany(() => Game, (game) => game.player_1)
	p1_game: Game[]

	@OneToMany(() => Game, (game) => game.player_2)
	p2_game: Game[]

	@OneToMany(() => Block, (block) => block.user)
	blocklist: Block[];

	@OneToMany(() => Block, (block) => block.blocked_user)
	blockedlist: Block[];

}
