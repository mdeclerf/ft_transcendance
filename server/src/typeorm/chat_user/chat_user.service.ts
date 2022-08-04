import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../typeorm.module';
import { ChatUser } from './chat_user.entity';

@Injectable()
export class ChatUserService {

	@InjectRepository(ChatUser)
	private readonly repository: Repository<ChatUser>;

	// GIVEN ROOM GETTER

	// Return every entry in a given room
	public	getRoomAll(id: number): Promise<ChatUser[]> {
		return this.repository.find({
			where: [{room_number : id}]
		});
	}

	// Return every users in a given room
	public	getRoomUser(id: number): Promise<ChatUser[]> {
		return this.repository.find({
			where: [
				{room_number : id},
				{status: 0}]
		});
	}
	
	// Return every admins in a given room
	public	getRoomAdmin(id: number): Promise<ChatUser[]> {
		return this.repository.find({
			where: [
				{room_number : id},
				{status: 1}]
		});
	}

	// Return every muted users in a given room
	public	getRoomMuted(id: number): Promise<ChatUser[]> {
		return this.repository.find({
			where: [
				{room_number : id},
				{status: 2}]
		});
	}

	// Return every banned users in a given room
	public	getRoomBaned(id: number): Promise<ChatUser[]> {
		return this.repository.find({
			where: [
				{room_number : id},
				{status: 3}]
		});
	}

	// Return every users with a given status in a given room
	public	getRoomStatus(id: number, status : number): Promise<ChatUser[]> {
		return this.repository.find({
			where: [
				{room_number : id},
				{status: status}]
		});
	}

	// GIVEN USER GETTER

	// Return every room of a given user
	public	getUser(id: User): Promise<ChatUser[]> {
		return this.repository.find({
			where: [
				{user : id}]
		});
	}

	// Return every room where a given user is in
	public	getUserRoom(id: User): Promise<ChatUser[]> {
		return this.repository.find({
			where: [
				{user : id},
				{status: 0}]
		});
	}

	// Return every room where a given user is admin
	public	getAdminRoom(id: User): Promise<ChatUser[]> {
		return this.repository.find({
			where: [
				{user : id},
				{status: 1}]
		});
	}

	// Return every room where a given user is mute
	public	getMuteRoom(id: User): Promise<ChatUser[]> {
		return this.repository.find({
			where: [
				{user : id},
				{status: 2}]
		});
	}

	// Return every room where a given user is banned
	public	getBanRoom(id: User): Promise<ChatUser[]> {
		return this.repository.find({
			where: [
				{user : id},
				{status: 3}]
		});
	}

	// Return every room with a given status of a given user
	public	getStatusRoom(id: User, status : number): Promise<ChatUser[]> {
		return this.repository.find({
			where: [
				{user : id},
				{status: status}]
		});
	}
}
