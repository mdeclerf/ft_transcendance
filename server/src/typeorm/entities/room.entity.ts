import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Chat } from "../";
import { ChatUser } from "../";

@Entity()
export class Room {

	@PrimaryGeneratedColumn()
	public id!: number;

	@Column({type: 'text', unique: true})
	public name: string;

	/*
	0 is public
	1 is protected
	2 is private
	*/
	@Column({type: 'integer'})
	public type: number;

	@Column({nullable: true, type: 'text'})
	public hash: string;

	@CreateDateColumn({ type: 'timestamp' })
 	public created_at!: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	public updated_at!: Date;

	@OneToMany(() => Chat, (chat) => chat.room)
	chat: Chat[];

	@OneToMany(() => ChatUser, (chat_user) => chat_user.room)
	chat_user : ChatUser[];
}
