import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Chat } from "../";
import { ChatUser } from "../";

@Entity()
export class Room {

	@PrimaryGeneratedColumn()
	public id!: number;

	@Column({type: 'text', unique: true})
	public name: string;

	@Column({type: 'text', default: 'public'})
	public type: 'public' | 'protected' | 'private';

	@Column({nullable: true, type: 'text'})
	public hash: string;

	@CreateDateColumn({ type: 'timestamp' })
 	public created_at!: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	public updated_at!: Date;

	@OneToMany(() => Chat, (chat) => chat.room, { onDelete: 'CASCADE' })
	chat: Chat[];

	@OneToMany(() => ChatUser, (chat_user) => chat_user.room, { onDelete: 'CASCADE' })
	chat_user : ChatUser[];
}
