import { Component, ViewChild } from '@angular/core';
import { NavController, Nav, AlertController } from 'ionic-angular';
import { MyDecksPage } from '../my-decks/my-decks';
import { TranslateService } from '@ngx-translate/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { Config } from '../../config';
// import { ImagesService } from '../../images.services.ts';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'page-create-deck',
  templateUrl: 'create-deck.html',
})
export class CreateDeckPage {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = CreateDeckPage;

  public googObj: any;
  public photos: any;
  public base64Image: string;
  public picUrl: any;
  public deckName: string;
  public object: any;
  public googleReq: any;
  public camData: any;
  public posts: any;
  public fromCam: any;
  public fromRoll: any;

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private alertCtrl: AlertController,
    private http: Http,
    private config: Config,
    public translateService: TranslateService,
  ) {
    translateService.use('en');
    this.fromCam = this.camera.PictureSourceType.CAMERA;
    this.fromRoll = this.camera.PictureSourceType.PHOTOLIBRARY;
    this.http = http;
  }
  ngOnInit() {
    this.photos = [];
  }


  createDeckInDB(name) {
    this.deckName = name;
  }
  //  private serverUrl =  'http://79e820ac.ngrok.io';
  // private serverUrl = 'https://httpbin.org/ip';
  private serverUrl = `https://vision.googleapis.com/v1/images:annotate?key=${this.config.googleKey}`;

  getGoogle(imgUrl) {
    this.googleReq = {
      "requests": [{"image":{"source":{"imageUri":imgUrl}},"features":
                [{"type": "LABEL_DETECTION","maxResults": 1}]}]}
    this.http.post(this.serverUrl, this.googleReq).map(res => res.json()).subscribe(data => {
      console.log(JSON.stringify(data.responses[0].labelAnnotations[0].description));
      return JSON.stringify(data.responses[0].labelAnnotations[0].description);
    })
  }
  grabPhoto(method){
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 300,
      targetHeight: 300,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: method,
    }
      this.camera.getPicture(options).then((imageData) => {
      imageData = imageData.replace(/\r?\n|\r/g, "");
      // this.base64Image = this.config.devMode ?  this.config.base64ImageData : 'data:image/jpeg;base64,' + imageData;
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      var newForm = new FormData();
      newForm.append("file", this.base64Image);
      newForm.append("upload_preset", this.config.cloudinary.uploadPreset);
      return newForm
      }).then(base64 => this.camData = base64)
  }
  
  takePhoto() {
    // const options: CameraOptions = {
    //   quality: 100,
    //   targetWidth: 300,
    //   targetHeight: 300,
    //   destinationType: this.camera.DestinationType.DATA_URL,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE,
    //   sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    // }
    // this.camera.getPicture(options).then((imageData) => {
    //   imageData = imageData.replace(/\r?\n|\r/g, "");
    //   // this.base64Image = this.config.devMode ?  this.config.base64ImageData : 'data:image/jpeg;base64,' + imageData;
    //   this.base64Image = 'data:image/jpeg;base64,' + imageData;
    //   var newForm = new FormData();
    //   newForm.append("file", this.base64Image);
    //   newForm.append("upload_preset", this.config.cloudinary.uploadPreset);
      this.http.post(`https://api.cloudinary.com/v1_1/${this.config.cloudinary.cloudId}/image/upload`, this.grabPhoto(this.fromRoll))
        .subscribe(info => {
          this.picUrl = info.json();
          // console.log(JSON.stringify(info));
          this.picUrl = this.picUrl.url;
          var alert1 = this.alertCtrl.create({
            title: "Data Stringzy",
            subTitle: JSON.stringify(this.picUrl),
            buttons: ["close"]
          });
          alert1.present(alert1);
          // var url = this.picUrl;
          this.http.post(`http://bbbc568b.ngrok.io/v1/cloudinaryurltogoogle/`, { "url": this.picUrl })
            .subscribe(info => {
              console.log('INSIDE!!!!!!!!!!!!!!!!!!!!!!');
              this.object = info.json();
              console.log(JSON.stringify(this.object));
            }, error => {
              var alertErr = this.alertCtrl.create({
                title: "ERROR1",
                subTitle: JSON.stringify(this.object),
                buttons: ["close"]
              });
              alertErr.present(alertErr);
            });
          this.photos.push(this.base64Image);
          this.photos.reverse();
        }, error => {
          var alertErr = this.alertCtrl.create({
            title: "ERROR",
            subTitle: JSON.stringify(error.json().error),
            buttons: ["close"]
          });
          alertErr.present(alertErr);
        });
    // }, (err) => {
      // Handle error
      // console.log(err);
    // })
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

  cameraRoll() {
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 300,
      targetHeight: 300,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    }
    console.log("Inside Camera Roll");
    this.camera.getPicture(options)
      .then((imageData) => {
        //get image data from camera roll
        console.log('imageData', typeof imageData, imageData)
        imageData = imageData.replace(/\r?\n|\r/g, "");
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
        var newForm = new FormData();
        newForm.append("file", this.base64Image);
        newForm.append("upload_preset", this.config.cloudinary.uploadPreset);
        console.log('newForm Data:', imageData, JSON.stringify(newForm));

        this.photos.push(this.base64Image);
        this.photos.reverse();
        return newForm;
      })
      .then(imgFormatted => {
        return this.http.post(`https://api.cloudinary.com/v1_1/${this.config.cloudinary.cloudId}/image/upload`, imgFormatted)
          .map(info => {
            this.picUrl = info.json().url;
            console.log(this.picUrl);
            return this.picUrl;
          })
          .subscribe(url => {
            this.getGoogle(url);
          }, err => console.log(err));
      })
  }


  findCard() {

  };

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateDeckPage');
  }

  click() {
    console.log('they gone think i won a grammy!!!!!!')
  }

  createDeck() {
    this.navCtrl.setRoot(MyDecksPage)
  }

}