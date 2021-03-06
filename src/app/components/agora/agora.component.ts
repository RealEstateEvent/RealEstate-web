import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as AgoraRTM from 'agora-rtm-sdk';
import * as AgoraRTC from 'agora-rtc-sdk';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../shared/services/internal/auth/auth.service';
import { DataSharedService } from '../../shared/services/internal/data-shared/data-shared.service';
import { ChatService } from '../../shared/services/socket/socket.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-agora',
  templateUrl: './agora.component.html',
  styleUrls: ['./agora.component.scss'],

  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgoraComponent implements OnInit, OnDestroy {
  isMsgPaneOpen: boolean = false;
  evt_data;
  agenda_id;
  chatClient;
  chatChannel;
  role;
  streamClient;
  localStream;
  user_id;
  remoteStreams = [];
  isMuteVideo: boolean = false;
  isMuteAudio: boolean = false;
  isOneScreen: boolean = true;
  public form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private chatService: ChatService,
    private formBuilder: FormBuilder,
    private dataSharedService: DataSharedService
  ) {
    this.dataSharedService.setAgoraStatus(true);
    this.dataSharedService.getEventData().subscribe((evt) => {
      this.evt_data = evt;
      console.log('------------eventData----------------', this.evt_data);
    });
    this.user_id = this.authService.getUserIDFromToken();
    // alert(this.user_id);
    this.chatClient = AgoraRTM.createInstance(environment.agoraAppID);
    this.streamClient = AgoraRTC.createClient({ mode: 'live', codec: 'h264' });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      msg: ['', [Validators.required]],
    }); 
    this.agenda_id = this.route.snapshot.queryParams.meetingid;
    //role can be of "host" or "audience".
    this.role = 'host';
    this.startCall();
  }

  ngOnDestroy(): void {
    this.dataSharedService.setAgoraStatus(false);
  }

  toggleMsgPane() {
    this.isMsgPaneOpen = !this.isMsgPaneOpen;
  }

  startCall() {
    let userWithRole = this.user_id + '.' + this.role;
    console.log('startCall', userWithRole);
    this.streamClient.init(
      environment.agoraAppID,
      () => console.log('AgoraRTC client initialized'),
      (err) => {
        console.log('err', err);
      }
    );
    this.streamClient.setClientRole(this.role, function (e) {
      if (!e) {
        console.log('setHost success');
      } else {
        console.log('setHost error', e);
      }
    });

    this.streamClient.join(null, this.agenda_id, userWithRole, (uid) => {
      // Stream object associated with your web cam is initialized
      this.localStream = AgoraRTC.createStream({
        streamID: uid,
        audio: true,
        video: true,
        screen: false,
      });

      this.subscribeToStreams();
      this.initChat(uid);
    });
  }

  private subscribeToStreams() {
    let $this = this;

    this.localStream.on('accessAllowed', () => {
      console.log('accessAllowed');
    });
    // The user has denied access to the camera and mic.
    this.localStream.on('accessDenied', () => {
      console.log('accessDenied');
    });

    if (this.role == 'host') {
      this.localStream.init(
        () => {
          this.localStream.play('local');

          this.streamClient.publish(this.localStream, (err) => {
            console.log('err@@@@@@@@@@', err);
          });
        },
        (err) => {
          console.log('err############', err);
        }
      );
    }

    //When a stream is added to a channel
    this.streamClient.on('stream-added', function (evt) {
      console.log('\non stream added\n', evt);

      $this.streamClient.subscribe(evt.stream, (err) => {
        console.log('\nstream subscribe err!!!!!!!!!!!!!!!\n', err);
      });
    });

    //When you subscribe to a stream
    this.streamClient.on('stream-subscribed', function (evt) {
      var remoteStream = evt.stream;
      $this.remoteStreams.push(evt);
      if($this.remoteStreams.length > 0) {
        $this.isOneScreen = false;
      }
      var id = remoteStream.getId();
      // Add a view for the remote stream.
      $this.addVideoStream('remote_video_' + id);
      // Play the remote stream.
      remoteStream.play('remote_video_' + id);
      console.log('stream-subscribed remote-uid: ', id);
    });

    //When a person is removed from the stream
    this.streamClient.on('stream-unpublished', () => {
      console.log('@@@@@@@@@@@@@@@unpublish@@@@@@@@@');
    });
    // client.on('stream-removed', removeVideoStream);
    this.streamClient.on('peer-leave', (evt) => {
      var remoteStream = evt.stream;
      $this.remoteStreams = $this.remoteStreams.filter(evt => evt.stream.getId() !== remoteStream.getId());
      console.log(`${evt.uid} left from this channel`);
      if($this.remoteStreams.length == 0) {
        this.isOneScreen = true;
      }
      $this.removeVideoStream(evt);
    });
  }

  addVideoStream(streamId) {
    let remoteContainer = document.getElementById('video_call_wrapr');
    let streamDiv = document.createElement('div'); // Create a new div for every stream
    streamDiv.id = `${streamId}`; // Assigning id to div
    streamDiv.className = 'video_col';
    streamDiv.style.transform = 'rotateY(180deg)'; // Takes care of lateral inversion (mirror image)
    remoteContainer.appendChild(streamDiv); // Add new div to container
  }

  removeVideoStream(evt) {
    let stream = evt.stream;
    stream.stop();
    let remDiv = document.getElementById('remote_video_' + stream.getId());
    console.log('remDiv', remDiv);
    if (remDiv) {
      remDiv.parentNode.removeChild(remDiv);
    }
    console.log('Remote stream is removed ' + stream.getId());
  }

  initChat(uid) {
    let $this = this;
    let userId = uid.toString();
    // let userWithRole = userId + "." + this.role;
    let userWithRole = userId;
    this.chatChannel = this.chatClient.createChannel(this.agenda_id);
    this.chatClient
      .login({ token: null, uid: userWithRole })
      .then(() => {
        console.log('AgoraRTM chatClient login success');
        this.chatChannel
          .join()
          .then(() => {
            console.log(`User id joined a chat channel userId: ${userId} `);
          })
          .catch((error) => {
            console.log(
              `Error chat channel join userId: ${userId} error: ${error} `
            );
          });
      })
      .catch((err) => {
        console.log('AgoraRTM chatClient login failure', err);
      });

    this.chatClient.on('ConnectionStateChange', (newState, reason) => {
      console.log(
        'on connection state changed to ' + newState + ' reason: ' + reason
      );
    });

    this.chatChannel.on('ChannelMessage', ({ text }, senderId) => {
      // text: text of the received channel message; senderId: user ID of the sender.
      let senderArr = senderId.split(/[.\-_]/);
      console.log('arr', senderArr);
      if (senderArr[1] == 'host') {
        console.log('arr[0]', senderArr[0]);
        console.log('event', $this.evt_data);
        let user = this.searchUserDetails(
          senderArr[0],
          $this.evt_data.speakerList
        );
        console.log('SSSSSSSSSSSSSSSSSSSS@user', user);
        this.addChatIntoView(user, text);
      } else {
        let user = this.searchUserDetails(
          senderArr[0],
          $this.evt_data.attendeeList.docs
        );
        console.log('@@@@@@@@@@@@@@@@@@@@@user', user);
        this.addChatIntoView(user, text);
      }
    });
  }

  searchUserDetails(key, userList) {
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].id === key) {
        return userList[i];
      }
    }
  }

  sendMessage() {
    let $this = this;
    let text = this.form.value.msg;
    console.log('message :- ', text);
    if(this.form.valid) {
    this.chatChannel
      .sendMessage({ text: text })
      .then(() => {
        let user = this.searchUserDetails(
          this.user_id,
          $this.evt_data.speakerList
        );
        $this.form.reset();
        console.log('@@@@@@@@@@@@@@', user);
        this.addChatIntoView(user, text);
        this.sendSocketMessage(text, this.agenda_id, this.user_id);
      })
      .catch((error) => {
        console.log(`send message faild userId : ${text} Error: ${error}`);
      });
    }
  }

  addChatIntoView(user, msg) {
    var mainnode = document.createElement('div');
    console.log('******************', mainnode);
    var usernode = document.createElement('a');
    usernode.className = 'user_icn';
    var userimage = document.createElement('img');
    userimage.src = user.profilePicThumb;
    var namenode = document.createTextNode(
      user.firstName + ' ' + user.lastName
    );
    usernode.appendChild(userimage);
    usernode.appendChild(namenode);
    var rolenode = document.createElement('p'); // Create a text node
    rolenode.innerHTML = `${user.role}`;
    var msgnode = document.createElement('p');
    msgnode.innerHTML = `${msg}`;
    msgnode.className = 'font_13';
    mainnode.appendChild(usernode);
    mainnode.appendChild(rolenode);
    mainnode.appendChild(msgnode);
    if (user.id === this.user_id) {
      mainnode.className = 'outgoing_msg';
    } else {
      mainnode.className = 'incoming_msg';
    }
    document.getElementById('messageSection').appendChild(mainnode);
  }

  leave() {
    this.chatChannel.leave();
    this.chatClient.logout();
    let $this = this;
    this.streamClient.leave(
      function () {
        console.log('client leaves channel');
        if ($this.localStream) {
          $this.streamClient.unpublish($this.localStream, function (err) {
            console.log('+++++++++++++=', err);
            $this.localStream.stop();
            $this.localStream.close();
            $this.localStream = null;
          });
        }
        while ($this.remoteStreams.length > 0) {
          let evt = $this.remoteStreams.shift();
          let stream = evt.stream;
          stream.stop();
          $this.removeVideoStream(evt);
        }

        $this.router.navigate(['/dashboard', $this.evt_data.event_id, 'talks']);
      },
      function (err) {
        console.log('client leave failed ', err);
      }
    );
  }

  muteVideo() {
    this.localStream.muteVideo();
    this.isMuteVideo = true;
  }

  unmuteVideo() {
    this.localStream.unmuteVideo();
    this.isMuteVideo = false;
  }

  muteAudio() {
    this.localStream.muteAudio();
    this.isMuteAudio = true;
  }

  unmuteAudio() {
    this.localStream.unmuteAudio();
    this.isMuteAudio = false;
  }

  sendSocketMessage(message, channelId, userId) {
    let messageObj = {
      msg: message,
      channelId: channelId,
      userId: userId,
    };
    this.chatService.sendMessage(messageObj);
  }
}
