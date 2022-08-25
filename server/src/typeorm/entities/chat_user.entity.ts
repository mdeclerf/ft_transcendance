import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room.entity";
import { User } from "./user.entity";

@Entity()
export class ChatUser {

	@PrimaryGeneratedColumn()
	public id!: number;

	@Column ({type: 'integer'})
	public room_number: number;

	@ManyToOne(() => Room, (room) => room.chat_user)
	room: Room

	@ManyToOne(() => User, (user) => user.chat_user)
	user: User

	// 0: is in the chat
	// 1: admin
	// 2: muted
	// 3: banned
	@Column({type: 'text'})
	public status: "user" | "admin" | "muted" | "banned";

	// Date when the ban or the mute is over
	@Column()
	public endStatusDate: Date;
}