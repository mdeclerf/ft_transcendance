import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';

@Entity()
export class Game {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({type: 'text'})
    socket_id: string;

	@Column({type: 'text'})
    socket_id_opponent: string;

	@Column({type: 'text'})
    login: string;
	
	@Column({type: 'text'})
    login_opponent: string;
	
    @Column({type: 'text'})
    mode: string;

	@Column({type: 'integer'})
    score: number;

	@Column({type: 'integer'})
    score_opponent: number;

	@Column({type: 'boolean'})
	has_won: boolean;

    @CreateDateColumn({ type: 'timestamp'})
    createdAt: Date;
}
