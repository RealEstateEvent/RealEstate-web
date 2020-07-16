import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { groupMessage } from './socket.message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: Socket) {}

  public sendMessage(messageObj : object) {
      alert("sending message from UI")
    this.socket.emit('new-message', JSON.stringify(messageObj));
  }
}
