import { Component, ViewChild } from '@angular/core';
import { NavController, Nav, AlertController, LoadingController } from 'ionic-angular';

import { MyDecksPage } from '../my-decks/my-decks';
import { FindCardPage } from '../find-card/find-card';
import { CardPage } from '../card/card';

import { TranslateService } from '@ngx-translate/core';
import { OAuthService } from '../oauth/oauth.service';
import { LanguageService } from '../../services/language.service';
import { CameraService } from '../../services/camera.service';
import { DeckService } from '../../services/deck.service';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http } from '@angular/http';
import { Config } from '../../config';

@Component({
  selector: 'page-create-deck',
  templateUrl: 'create-deck.html',
})
export class CreateDeckPage {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = CreateDeckPage;
  public photos: any;
  public base64Image: string;
  public picUrl: string;
  public profile: any;
  public fourN: any;
  public title: any;
  public translatedWord;
  public counter: number = 0;
  public deckId;
  public cards: Array<object>;

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private http: Http,
    private config: Config,
    public translateService: TranslateService,
    private oauthService: OAuthService,
    public languageService: LanguageService,
    public cameraService: CameraService,
    public deckService: DeckService) {
    oauthService.getProfile().toPromise()
      .then(profile => {
        this.profile = profile;
        translateService.use(languageService.translateLang(this.profile.nativeLang));
        this.cameraService.languages(this.languageService.translateLang(this.profile.nativeLang), this.languageService.translateLang(this.profile.learnLang))
      })
      .catch(err => {
        console.log("Error" + JSON.stringify(err))
      });
    this.http = http;
    if (this.deckService.deckCreation().length > 0) {
      this.cards = this.deckService.deckCreation().reverse();
    }
    if (this.cameraService.getTitle()) {
      this.title = this.cameraService.getTitle();
    }
  }
  ngOnInit() {
    this.photos = [];
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

  findCard() {
    if (this.title) {
      console.log('Find card click success:');
      this.navCtrl.setRoot(FindCardPage);
    } else {
      let confirm = this.alertCtrl.create({
        title: `Looks like you didn't add a deck name... You're gonna have to do that first.`,
        message: '',
        buttons: [
          {
            text: 'Oh...got it. ',
            handler: () => {
            }
          },
        ]
      });
      confirm.present();
    }
  }

  addATitle(title) {
    this.title = title;
    this.cameraService.addTitle(this.title)
    this.deckId = this.deckService.postUserDeck(this.title, this.profile.id)

  }

  createDeck() {
    this.deckService.clearDeckCreation();
    this.cameraService.deleteTitle();
    this.navCtrl.setRoot(MyDecksPage);
  }

  setTranslation() {
    this.translatedWord = this.cameraService.getTranslatedWord();
    this.photos[this.counter]['translation'] = this.translatedWord;
    this.counter = this.photos.length - 1;
  }

  picture(location) {
    if (this.title) {
      if (location === "Camera") {
        var type = this.camera.PictureSourceType.CAMERA;
      } else {
        var type = this.camera.PictureSourceType.PHOTOLIBRARY;
      }
      const options: CameraOptions = {
        quality: 100,
        targetWidth: 300,
        targetHeight: 300,
        correctOrientation: true,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: type,
      }
      this.camera.getPicture(options).then((imageData) => {
        imageData = imageData.replace(/\r?\n|\r/g, "");
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
        var newForm = new FormData();
        newForm.append("file", this.base64Image);
        newForm.append("upload_preset", this.config.cloudinary.uploadPreset);
        this.photos.push({ image: this.base64Image });
        this.photos.reverse();
        return newForm;
      }).then(imgFormatted => {
        this.cameraService.sendPic(imgFormatted)
        this.cameraService.showLoading(5000);
        setTimeout(() => {
          this.fourN = this.cameraService.getWord();
          this.cameraService.getTranslation(this.fourN)
          this.photos[this.counter]['word'] = this.fourN;
          console.log('this.fourN')
          console.log(JSON.stringify(this.fourN));
          console.log('this.fourN')
          this.deckService.addToDeckCreation(this.photos[this.counter])
          this.navCtrl.setRoot(CardPage)
        }, 3000);
      })
    } else {
      let confirm = this.alertCtrl.create({
        title: `Looks like you didn't add a deck name... You're gonna have to do that first.`,
        message: '',
        buttons: [
          {
            text: 'Oh...got it. ',
            handler: () => {
            }
          },
        ]
      });
      confirm.present();
    }
  }
}
