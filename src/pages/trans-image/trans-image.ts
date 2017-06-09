import { Component, ViewChild } from '@angular/core';
import { NavController, Nav, AlertController, LoadingController } from 'ionic-angular';

import { MyDecksPage } from '../my-decks/my-decks';
import { FindCardPage } from '../find-card/find-card';
import { CardPage } from '../card/card';
import { HomePage } from '../home/home';

import { TranslateService } from '@ngx-translate/core';
import { OAuthService } from '../oauth/oauth.service';
import { LanguageService } from '../../services/language.service';
import { CameraService } from '../../services/camera.service';
import { TransImageService } from '../../services/transimage.service';
import { DeckService } from '../../services/deck.service';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http } from '@angular/http';
import { Config } from '../../config';

@Component({
  selector: 'page-trans-image',
  templateUrl: 'trans-image.html',
})
export class TransImagePage {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = TransImagePage;
  public photo: any;
  public base64Image: string;
  public picUrl: string;
  public profile: any;
  public fourN: any;
  public translatedWord;
  public nativeLang: string;
  public learnLang: string;
  public native: string;

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private http: Http,
    private config: Config,
    public translateService: TranslateService,
    oauthService: OAuthService,
    public languageService: LanguageService,
    public transImageService: TransImageService) {
    oauthService.getProfile().toPromise()
      .then(profile => {
        this.profile = profile;
        this.nativeLang = this.languageService.translateLang(this.profile.nativeLang);
        this.learnLang = this.languageService.translateLang(this.profile.learnLang);
        this.transImageService.setLearnAndNativeLangs(this.nativeLang, this.learnLang);
        translateService.use(languageService.translateLang(this.profile.nativeLang));
        this.transImageService.languages(this.languageService.translateLang(this.profile.nativeLang), this.languageService.translateLang(this.profile.learnLang))
      })
      .catch(err => {
        console.log("Error" + JSON.stringify(err))
      });
    this.http = http;
  }
  ngOnInit() {
    this.photo = '';
  }
  takePhoto() {
      const options: CameraOptions = {
        quality: 100,
        targetWidth: 300,
        targetHeight: 300,
        correctOrientation: true,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.CAMERA,
      }
      this.camera.getPicture(options).then((imageData) => {
        imageData = imageData.replace(/\r?\n|\r/g, "");
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
        var newForm = new FormData();
        newForm.append("file", this.base64Image);
        newForm.append("upload_preset", this.config.cloudinary.uploadPreset);
        this.photo = this.base64Image;
        return newForm;
      }).then(imgFormatted => {
        this.transImageService.sendPic(imgFormatted)
        this.transImageService.showLoading(5000);
        setTimeout(() => {
          this.fourN = this.transImageService.getWord();
          this.native = this.transImageService.getNativeWord();
        }, 3000)
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
            this.photo = '';
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
        correctOrientation: true,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      }

      this.camera.getPicture(options).then((imageData) => {
        imageData = imageData.replace(/\r?\n|\r/g, "");
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
        var newForm = new FormData();
        newForm.append("file", this.base64Image);
        newForm.append("upload_preset", this.config.cloudinary.uploadPreset);
        this.photo = this.base64Image;
        return newForm;
      }).then(imgFormatted => {
        this.transImageService.sendPic(imgFormatted)
        this.transImageService.showLoading(5000);

        setTimeout(() => {
          this.fourN = this.transImageService.getWord();
        }, 3000)
      })
  }
  setTranslation() {
    this.translatedWord = this.transImageService.getTranslatedWord();
  }
  goHome() {
    this.navCtrl.setRoot(HomePage)
  }
}
