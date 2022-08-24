import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class BlockList {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(type => User, user => user.blocking)
	blocker: User;

	@ManyToOne(type => User, user => user.blocked_by)
	blockee: User;

	@CreateDateColumn()
	date: Date;
}