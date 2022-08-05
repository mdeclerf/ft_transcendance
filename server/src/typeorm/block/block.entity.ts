import { Entity, ManyToOne, PrimaryGeneratedColumn, useContainer } from "typeorm"
import { User } from "../typeorm.module";

@Entity()
export class Block {

	@PrimaryGeneratedColumn()
	public id: number;

	@ManyToOne(() => User, (user) => user.blocklist)
	public user: User;

	@ManyToOne(() => User, (user) => user.blockedlist)
	public blocked_user: User;
}