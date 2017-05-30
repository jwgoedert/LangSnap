import { Component, ViewChild } from '@angular/core';
import { NavController, Nav, AlertController } from 'ionic-angular';
import { MyDecksPage } from '../my-decks/my-decks';
import { TranslateService } from '@ngx-translate/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http } from '@angular/http';
import { Config } from '../../config';
import { OAuthService } from '../oauth/oauth.service';
import { LanguageService } from '../../services/language.service';
import { ImagesService } from '../../images.services.ts';
// import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Component({
  selector: 'page-create-deck',
  templateUrl: 'create-deck.html',
})
export class CreateDeckPage {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = CreateDeckPage;

  public photos: any;
  public base64Image: string;
	public profile: any;
  public picUrl: any;
  public deckName: string;
  public object: any;
  public objectUrl: string;

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private alertCtrl: AlertController,
    private http: Http,
    private config: Config,
    public translateService: TranslateService,
    oauthService: OAuthService,
    public languageService: LanguageService) {
    oauthService.getProfile().toPromise()
        .then(profile => {
          this.profile = profile;
          translateService.use(languageService.translateLang(this.profile.nativeLang));
        })
        .catch(err => {
          console.log("Error" + JSON.stringify(err))
        }); 
    this.http = http;
  }
  ngOnInit() {
    this.photos = [];
  }
  createDeckInDB(name) {
    this.deckName = name;
  }
  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 300,
      targetHeight: 300,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    }
    this.camera.getPicture(options).then((imageData) => {
      imageData = imageData.replace(/\r?\n|\r/g, "");
      // this.base64Image = this.config.devMode ?  this.config.base64ImageData : 'data:image/jpeg;base64,' + imageData;
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      var newForm = new FormData();
      newForm.append("file", this.base64Image);
      newForm.append("upload_preset", this.config.cloudinary.uploadPreset);
      this.http.post(`https://api.cloudinary.com/v1_1/${this.config.cloudinary.cloudId}/image/upload`, newForm)
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
      //put photos in grid for viewing  
      // this.objectUrl = JSON.stringify(url);
      // var newForm1 = new FormData();
      // newForm.append("url", JSON.stringify(url));

    }, (err) => {
      // Handle error
      console.log(err);
    })
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
          }).toPromise()
      })
      .then(url => {
        console.log('BeforeGoogle:', url);
        return this.http.post(`http://bbbc568b.ngrok.io/v1/cloudinaryurltogoogle/`, { "url": url})
          .subscribe(res => {
            console.log('Inside Post', res);
            // this.object = res.json();
            // console.log('RES', JSON.stringify(res));
            // console.log('res from GOOGLE:', this.object);
            // return this.object;
        })
      })
      .catch(err => {
        console.log('error from map:',JSON.stringify(err));
      });


    // .subscribe(res => console.log(JSON.stringify(res)));

    // return info.json().url;
    //put photos in grid for viewing  

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