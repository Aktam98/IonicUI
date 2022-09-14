import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { MessageDto } from '../Dto/MessageDto';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.page.html',
  styleUrls: ['./channel.page.scss'],
})
export class ChannelPage implements OnInit {

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.chatService.retriveMappedObject().subscribe((receivedObj: MessageDto)=>{this.addToInbox(receivedObj);});
  }

  msgDto: MessageDto=new MessageDto();
  data: MessageDto=new MessageDto();
  date: Date=new Date();

  send(): void{
    if(this.msgDto){
      if(this.msgDto.user.length==0||this.msgDto.user.length==0){
        window.alert('Both fields are required');
        return;
      }
      else{
        this.chatService.broadcastMessage(this.msgDto);
      }
    }
  }

  addToInbox(obj: MessageDto){
    const newObj=new MessageDto();
    newObj.user=obj.user;
    newObj.msgText=obj.msgText;
    this.data=newObj;
    this.date=new Date();
  }

}
