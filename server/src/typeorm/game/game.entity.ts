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
    player_1_id: string;

    @Column({type: 'text'})
    player_2_id: string;

    @Column({type: 'text'})
    player_1_login: string;

    @Column({type: 'text'})
    player_2_login: string;

	@Column({type: 'integer'})
    player_1_score: number;

	@Column({type: 'integer'})
    player_2_score: number;

    @Column({type: 'text'})
    mode: string;

    @CreateDateColumn({ type: 'timestamp'})
    createdAt: Date;
}
