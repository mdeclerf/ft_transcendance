import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User, Room } from "../";

@Entity()
export class Chat {

	@PrimaryGeneratedColumn()
	public message_id!: number;
	
	/*@Column ({type: 'integer'})
	public room_number: number;*/
	@ManyToOne(() => Room, (room) => room.chat)
	@JoinColumn({ name: 'room_id'})
	public room: Room;

	@Column({type: 'text'})
	public body: string;

	@ManyToOne(() => User, (user) => user.chat)
	@JoinColumn({ name: 'user_id' })
	user: User

	@CreateDateColumn({name: 'createdat', type: 'timestamp'})
	public createdAt!: Date;
}
