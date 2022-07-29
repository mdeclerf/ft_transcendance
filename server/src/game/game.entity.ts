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
    login: string;

    @Column({type: 'text'})
    mode: string;

	@Column({type: 'text'})
    opponent_login: string;

	@Column({type: 'integer'})
    score: number;

	@Column({type: 'integer'})
    opponent_score: number;

	@Column({type: 'boolean'})
	has_won: boolean;

    @CreateDateColumn({ type: 'timestamp'})
    createdAt: Date;
}
