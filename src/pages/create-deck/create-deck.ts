import { Component, ViewChild } from '@angular/core';
import { NavController, Nav, AlertController } from 'ionic-angular';
import { MyDecksPage } from '../my-decks/my-decks';
import { TranslateService } from '@ngx-translate/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { Config } from '../../config';
import { OAuthService } from '../oauth/oauth.service';
import { LanguageService } from '../../services/language.service';
import { ImagesService } from '../../images.services.ts';
// import {Observable} from 'rxjs/Rx';
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
	public profile: any;
  public picUrl: any;
  public deckName: string;
  public object: any;
  public googleReq: any;
  public data: any;
  public posts: any;


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
  //  private serverUrl =  'http://79e820ac.ngrok.io';
  // private serverUrl = 'https://httpbin.org/ip';
  private serverUrl = `https://vision.googleapis.com/v1/images:annotate?key=${this.config.googleKey}`;

  getGoogle(imgUrl) {
    this.googleReq = {
      "requests": [{
        "image": { "source": { "imageUri": imgUrl } }, "features":
        [{ "type": "LABEL_DETECTION", "maxResults": 1 }]
      }]
    }
    this.http.post(this.serverUrl, this.googleReq).map(res => res.json()).subscribe(data => {
      console.log(JSON.stringify(data.responses[0].labelAnnotations[0].description));
      return JSON.stringify(data.responses[0].labelAnnotations[0].description);
    })
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
        this.getGoogle(url)
      })
      .catch(err => {
        console.log('error from map:', JSON.stringify(err));
      });
    this.photos.push(this.base64Image);
    this.photos.reverse();

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
        this.getGoogle(url)
      })
      .catch(err => {
        console.log('error from map:', JSON.stringify(err));
      });

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