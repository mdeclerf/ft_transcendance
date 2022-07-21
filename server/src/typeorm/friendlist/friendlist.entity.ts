import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Friendlist {
	
	@PrimaryGeneratedColumn()
	public id!: number;

	@Column({type: 'integer'})
	public user_id: number;

	@Column({type: 'integer'})
	public friend_id: number;

	@CreateDateColumn({type: 'timestamp'})
	public createdAt! : Date;
}