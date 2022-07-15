import { ISession } from "connect-typeorm/out";
import { Column, DeleteDateColumn, Entity, Index, PrimaryColumn } from "typeorm";

@Entity()
export class Session implements ISession {

	@Index()
	@Column('bigint')
	expiredAt: number;

	@PrimaryColumn('varchar', { length: 255 })
	id: string;

	@DeleteDateColumn({ name: 'destroyed_at', nullable: true})
	destroyedAt?: Date;

	@Column('text')
	json: string;

}