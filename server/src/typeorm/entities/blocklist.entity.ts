import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Blocklist {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(type => User, user => user.blocking)
	@JoinColumn({ name: 'blocker_id' })
	blocker: User;

	@ManyToOne(type => User, user => user.blocked_by)
	@JoinColumn({ name: 'blockee_id' })
	blockee: User;

	@CreateDateColumn()
	date: Date;
}