import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room.entity";
import { User } from "./user.entity";

@Entity()
@Index(['room', 'user'], { unique: true })
export class ChatUser {

	@PrimaryGeneratedColumn()
	public id!: number;

	@ManyToOne(() => Room, (room) => room.chat_user)
	@JoinColumn({ name: 'room_id' })
	room: Room

	@ManyToOne(() => User, (user) => user.chat_user)
	@JoinColumn({ name: 'user_id'})
	user: User

	@Column({type: 'text'})
	public status: "user" | "owner" | "admin" | "muted" | "banned";

	@CreateDateColumn({ name: 'join_date' })
	joinDate: Date;
}
