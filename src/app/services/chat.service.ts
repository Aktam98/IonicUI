import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { MessageDto } from '../Dto/MessageDto';
import { Observable,Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private connection: any=new signalR.HubConnectionBuilder().withUrl('http://localhost:5001/chatsocket')
  .configureLogging(signalR.LogLevel.Information).build();
    // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/member-ordering
  readonly POST_URL='http://localhos:5001/api/chat/send';
  
  private receivedMessageObject: MessageDto=new MessageDto();

  private sharedObj=new Subject<MessageDto>();

  constructor(private http: HttpClient) {
    this.connection.on('ReceiveOne',(user,message)=>{this.mapReceivedMessage(user,message);});
    this.start();
  }

  public async start() {
    try {
      await this.connection.start();
      console.log('connected');
    } catch (err) {
      console.log(err);
      setTimeout(() => this.start(), 5000);
    }
  }

  private mapReceivedMessage(user: string, message: string): void {
    this.receivedMessageObject.user = user;
    this.receivedMessageObject.msgText = message;
    this.sharedObj.next(this.receivedMessageObject);
 }

    // eslint-disable-next-line @typescript-eslint/member-ordering
  public broadcastMessage(msgDto: any){
    this.http.post(this.POST_URL,msgDto).subscribe(data=>console.log(data));
  }

    // eslint-disable-next-line @typescript-eslint/member-ordering
  public retriveMappedObject(): Observable<MessageDto>{
    return this.sharedObj.asObservable();
  }

}
