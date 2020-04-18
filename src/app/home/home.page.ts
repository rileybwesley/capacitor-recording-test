import { Component, OnInit } from '@angular/core';
import { Media } from '@ionic-native/media/ngx';
import { Plugins, FilesystemDirectory, FilesystemEncoding, FileReadResult, FileWriteResult } from '@capacitor/core';
import { Platform } from '@ionic/angular';
const { Filesystem } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  fileExtension = '.m4a';
  storageDirectory = FilesystemDirectory.Documents;

  constructor(
    private media: Media,
    private platform: Platform,
  ) {
    if (this.platform.is('android')) {
      this.fileExtension = '.3gp';
      this.storageDirectory = FilesystemDirectory.ExternalStorage;
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      Filesystem.writeFile({
        path: `record${this.fileExtension}`,
        directory: this.storageDirectory,
        data: '',
      }).then((fileWriteResult: FileWriteResult) => {
        console.log(fileWriteResult.uri);
        let mediaUrl = fileWriteResult.uri;
        if (this.platform.is('ios')) {
          mediaUrl = mediaUrl.replace(/^file:\/\//, '');
        }
        const mediaObject = this.media.create(mediaUrl);
        alert('Media object created: ' + mediaUrl);
        mediaObject.startRecord();
        alert('Recording started');
        window.setTimeout(() => {
          mediaObject.stopRecord();
          alert('Recording stopped');
          mediaObject.release();
          alert('Media object released');
          Filesystem.readFile({
            path: `record${this.fileExtension}`,
            directory: this.storageDirectory,
          }).then((result: FileReadResult) => {
            alert('Successfully read file as data url!');
            console.log(result);
            const audio = new Audio(`data:audio/aac;base64,${result.data}`);
            audio.play();
            alert('Playing file');
          });
        }, 5000);
      }).catch(error => {
        console.log(error);
        alert('Error writing file initial');
      });
    }, 2000);
  }

  // CapacitorTest() {
  //   VoiceRecorder.canDeviceVoiceRecord().then((canRecordResult: GenericResponse) => {
  //     alert(`Can record: ${canRecordResult.value}`);
  //     VoiceRecorder.hasAudioRecordingPermission.then((hasPermissionsResult: GenericResponse) => {
  //       alert(`Has permission: ${hasPermissionsResult.value}`);
  //       VoiceRecorder.startRecording().then((recordingResult: GenericResponse) => {
  //         alert(`Successfully started recording`);
  //         setTimeout(() => {
  //           VoiceRecorder.stopRecording().then((result: RecordingData) => {
  //             console.log(result);
  //             alert('Successfully recorded some sound');
  //           }).catch(error => {
  //             console.log(error);
  //             alert('Error stopping recording');
  //           });
  //         }, 3000);
  //       })
  //       .catch(error => {
  //         console.log(error);
  //         alert('Error recording sound');
  //       });
  //     }).catch(error => {
  //       console.log(error);
  //       alert('Error checking if Device has recording permission');
  //     });
  //   }).catch(error => {
  //     console.log(error);
  //     alert('Error checking if Device can record');
  //   });
  // }

}
