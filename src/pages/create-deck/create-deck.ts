import { Component, ViewChild, Injectable } from '@angular/core';
import { NavController, Nav, AlertController } from 'ionic-angular';//NavController
import { HomePage } from '../home/home';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http } from '@angular/http';
import { Config } from '../../config';
@Injectable()
@Component({
  selector: 'page-create-deck',
  templateUrl: 'create-deck.html',
})
export class CreateDeckPage {
  @ViewChild(Nav) nav: Nav;

  public photos: any;
  public base64Image: string;
  public data: string;
  public test: any;

  rootPage: any = HomePage;

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private alertCtrl: AlertController,
    private http: Http,
    private config: Config,
  ) {
    this.http = http;
  }
  ngOnInit() {
    this.photos = [];
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 50,
      targetWidth: 300,
      targetHeight: 300,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
    }
    this.camera.getPicture(options).then((imageData) => {
      // remove returns and format for cloudinary
      imageData = imageData.replace(/\r?\n|\r/g, "");
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      var newForm = new FormData();
      newForm.append("file", this.base64Image);
      newForm.append("upload_preset", this.config.cloudinary.uploadPreset);
      
      this.http.post(`https://api.cloudinary.com/v1_1/${this.config.cloudinary.cloudId}/image/upload`, newForm)
        .subscribe(info => {
          // alert for response
          // var alert = this.alertCtrl.create({
          //   title: "Data String",
          //   subTitle: JSON.stringify(info),
          //   buttons: ["close"]

          // });
          // alert.present(alert);
          console.log(JSON.stringify(info));
        }, error => {
          var alertErr = this.alertCtrl.create({
            title: "ERROR",
            subTitle: JSON.stringify(error.json().error),
            buttons: ["close"]
          });
          alertErr.present(alertErr);
        });
      //put photos in grid for viewing  
      this.photos.push(this.base64Image);
      this.photos.reverse();
    }, (err) => {
      // Handle error
      console.log(err);
    });
  }
  deletePhoto(index) {
    let confirm = this.alertCtrl.create({
      title: 'Sure you want to delete this photo?',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.photos.splice(index, 1);
          }
        }
      ]
    });
    confirm.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateDeckPage');
  }

  click() {
    console.log('they gone think i won a grammy!!!!!!')
  }
}





