import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ChatUser {

	@PrimaryGeneratedColumn()
	public id!: number;

	@Column ({type: 'integer'})
	public room_number: number;

	@Column({type: 'integer'})
	public user_id: number;

	// 0: is in the chat
	// 1: admin
	// 2: mute
	// 3: banned
	@Column({type: 'integer'})
	public status: number;

	// Date when the ban or the mute is over
	@Column()
	public endStatusDate: Date;
}