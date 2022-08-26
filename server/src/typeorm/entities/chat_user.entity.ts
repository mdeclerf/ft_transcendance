import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room.entity";
import { User } from "./user.entity";

@Entity()
export class ChatUser {

	@PrimaryGeneratedColumn()
	public id!: number;

	/*@Column ({type: 'integer'})
	public room_number: number;*/

	@ManyToOne(() => Room, (room) => room.chat_user)
	room: Room

	@ManyToOne(() => User, (user) => user.chat_user)
	user: User


	@Column({type: 'text'})
	public status: "user" | "owner" | "admin" | "muted" | "banned";
}
