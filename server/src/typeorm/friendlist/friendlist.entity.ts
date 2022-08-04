import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "../typeorm.module";

@Entity()
export class Friendlist {
	
	@PrimaryGeneratedColumn()
	public id!: number;

	/*@Column({type: 'integer'})
	public user_id: number;
	*/
	@ManyToOne(() => User, (user) => user.chat)
	user: User

	/*@Column({type: 'integer'})
	public friend_id: number;
*/
	@ManyToOne(() => User, (user) => user.chat)
	friend: User

	@CreateDateColumn({type: 'timestamp'})
	public createdAt! : Date;
}
