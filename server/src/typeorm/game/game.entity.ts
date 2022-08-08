import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
	ManyToOne,
} from 'typeorm';
import { User } from '../typeorm.module';

@Entity()
export class Game {
    @PrimaryGeneratedColumn('uuid')
    id: number;

	@ManyToOne(() => User, (user) => user.p1_game)
	public player_1 : User

	@ManyToOne(() => User, (user) => user.p2_game)
	public player_2 : User

	@Column({type: 'integer'})
    player_1_score: number;

	@Column({type: 'integer'})
    player_2_score: number;

    @Column({type: 'text'})
    mode: string;

    @CreateDateColumn({ type: 'timestamp'})
    createdAt: Date;
}
