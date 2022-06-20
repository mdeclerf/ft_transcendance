import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AppService } from './app.service';
import { Chat } from './chat.entity';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway
 implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
 constructor(private appService: AppService) {}
 
 @WebSocketServer() server: Server;
 private logger: Logger = new Logger('AppGateway');
 
 @SubscribeMessage('sendMessage')
 async handleSendMessage(client: Socket, payload: Chat): Promise<void> {
   await this.appService.createMessage(payload);
   this.server.emit('recMessage', payload);
 }
 
 afterInit(server: Server) {
  this.logger.log('Init');
   //Do stuffs
 }
 
 handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
   //Do stuffs
 }
 
 handleConnection(client: Socket, ...args: any[]) {
  this.logger.log(`Client connected: ${client.id}`);
   //Do stuffs
 }
}
