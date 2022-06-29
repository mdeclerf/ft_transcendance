import {
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Socket, Server } from 'socket.io';
  import { AppService } from './app.service';
  
  @WebSocketGateway({
	cors: {
	  origin: "http://localhost:3000",
	  methods: ["GET", "POST"],
	},
  })
  export class AppGateway
   implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  {
   constructor(private appService: AppService) {}
   
   @WebSocketServer() server: Server;
   users: number = 0;

   
   afterInit(server: Server) {
		//Do stuffs
   }
   
   handleDisconnect(client: Socket) {
		console.log(`User Disconnected: ${client.id}`);
		this.users--;
		//Do stuffs
   }
   
	handleConnection(client: Socket, ...args: any[]) {
		this.server.on("connection", (socket) => {
			console.log(`User Connected: ${socket.id}`);
	
	  socket.on("join_room", (data) => {
		socket.join(data);
	  });

		socket.on("send_message", (data) => {
			// socket.broadcast.emit("receive_message", data);
			socket.to(data.room).emit("receive_message", data);
		});
	});
  }
}