import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Subscription {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(type => User, user => user.subscriptions)
	@JoinColumn({ name: 'subscriber_id' })
	subscriber: User;

	@ManyToOne(type => User, user => user.subscribers)
	@JoinColumn({ name: 'subscribed_to_id' })
	subscribedTo: User;

	@CreateDateColumn()
	date: Date;
}