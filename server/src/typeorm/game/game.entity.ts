// import {
//     Entity,
//     Column,
//     PrimaryGeneratedColumn,
//     CreateDateColumn,
// } from 'typeorm';

// @Entity()
// export class Game {
//     @PrimaryGeneratedColumn('uuid')
//     id: number;

//     @Column({type: 'text'})
//     player_1_id: string;

//     @Column({type: 'text'})
//     player_2_id: string;

//     @Column({type: 'text'})
//     player_1_login: string;

//     @Column({type: 'text'})
//     player_2_login: string;

// 	@Column({type: 'integer'})
//     player_1_score: number;

// 	@Column({type: 'integer'})
//     player_2_score: number;

//     @Column({type: 'text'})
//     mode: string;

//     @CreateDateColumn({ type: 'timestamp'})
//     createdAt: Date;
// }

import { userInfo } from 'os';
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
