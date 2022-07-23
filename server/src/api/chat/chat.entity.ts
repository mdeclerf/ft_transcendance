
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Chat {

	@PrimaryGeneratedColumn()
	public message_id!: number;
	
	@Column ({type: 'integer'})
	public room_number: number;

	@Column({type: 'text'})
	public body: string;

	@CreateDateColumn({name: 'createdat', type: 'timestamp'})
	public createdAt!: Date;
}