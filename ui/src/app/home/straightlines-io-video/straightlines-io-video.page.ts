import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-straightlines-io-video',
  templateUrl: './straightlines-io-video.page.html',
  styleUrls: ['./straightlines-io-video.page.scss'],
})
export class StraightlinesIoVideoPage implements OnInit {

  constructor() { }

  ngOnInit() {
    var myVideo: any = document.getElementById("my_video_1");
    myVideo.play()
  }
video(){
  var myVideo: any = document.getElementById("my_video_1");
    if (myVideo.paused) myVideo.play();
    else myVideo.pause();
}
}
