import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';
 
@Entity()
export class Chat {
    @PrimaryGeneratedColumn('uuid')
    id: number;
 
    @Column()
    email: string;
 
    @Column()
    text: string;
 
    @CreateDateColumn()
    createdAt: Date;

}