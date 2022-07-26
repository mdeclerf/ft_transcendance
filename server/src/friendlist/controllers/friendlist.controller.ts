import { Controller, Inject } from '@nestjs/common';
import { FriendlistService } from '../services/friendlist.service';

@Controller('friendlist')
export class FriendlistController {
	constructor (@Inject('FRIENDLIST_SERVICE') private readonly friendlistService: FriendlistService) {}


}