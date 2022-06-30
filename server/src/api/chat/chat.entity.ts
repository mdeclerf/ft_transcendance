import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Chat {

	@PrimaryGeneratedColumn()
	public message_id!: number;

	@Column({type: 'text'})
	public body: string;

	@CreateDateColumn({ type: 'timestamp'})
	public createdAt!: Date;
}