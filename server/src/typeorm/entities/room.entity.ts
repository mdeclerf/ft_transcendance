import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Chat } from "../";

@Entity()
export class Room {

	constructor(partial: Partial<Room>) {
		Object.assign(this, partial);
	}

	@PrimaryGeneratedColumn()
	public id!: number;

	@Column({type: 'text', unique: true})
	public name: string;

	/*
	0 is public
	1 is protected
	2 is private
	*/
	@Column({type: 'text', default: 'public' })
	public type: 'public' | 'protected' | 'private';

	@Exclude()
	@Column({nullable: true, type: 'text' })
	public hash: string;

	@CreateDateColumn({ type: 'timestamp' })
 	public created_at!: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	public updated_at!: Date;

	@OneToMany(() => Chat, (chat) => chat.room)
	chat: Chat[];
}