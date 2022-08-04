import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Room {

	@PrimaryGeneratedColumn()
	public id!: number;

	@Column({type: 'text'})
	public name: string;

	/*
	0 is public
	1 is protected
	2 is private
	*/
	@Column({type: 'integer'})
	public type: number;

	@Column({type: 'text'})
	public hash: string;

	@CreateDateColumn({ type: 'timestamp' })
 	public created_at!: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	public updated_at!: Date;
}