import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {

	@PrimaryGeneratedColumn()
	public id!: number;

	@Column ({type: 'text', name: 'intra_id', unique: true})
	public intraId: string;

	@Column ({type: 'text'})
	public username: string;

	@Column ({type: 'text', name: 'display_name'})
	public displayName: string;

	@Column ({type: 'text', name: 'photo_url', nullable: true})
	public photoURL: string;

	@Column ({type: 'text', nullable: true})
	public twoFactorAuthenticationSecret: string;

	@Column ({default: false})
	public isTwoFactorAuthenticationEnabled: boolean;

	@ManyToMany(() => User, user => user.id)
	@JoinTable()
	friends: User[]
}
