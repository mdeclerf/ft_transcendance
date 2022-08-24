import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Subscription {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(type => User, user => user.subscriptions)
	subscriber: User;

	@ManyToOne(type => User, user => user.subscribers)
	subscribedTo: User;

	@CreateDateColumn()
	date: Date;
}