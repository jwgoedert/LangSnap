// import { Component, ViewChild } from '@angular/core';
// import { IonicPage, NavController, Nav, AlertController, NavParams, LoadingController } from 'ionic-angular';

// import { MyDecksPage } from '../my-decks/my-decks';
// import { FindCardPage } from '../find-card/find-card';
// import { CardPage } from '../card/card';

// import { TranslateService } from '@ngx-translate/core';
// import { OAuthService } from '../oauth/oauth.service';
// import { LanguageService } from '../../services/language.service';
// import { CameraService } from '../../services/camera.service';
// import { DeckService } from '../../services/deck.service';

// import { Camera, CameraOptions } from '@ionic-native/camera';
// import { Http } from '@angular/http';
// import { Config } from '../../config';

// @IonicPage()
// @Component({
//   selector: 'page-edit-deck-add',
//   templateUrl: 'edit-deck-add.html',
// })

// export class EditDeckAddPage {
//   @ViewChild(Nav) nav: Nav;
//   rootPage: any = EditDeckAddPage;
//   public photos: any;
//   public base64Image: string;
//   public picUrl: string;
//   public profile: any;
//   public fourN: any;
//   public title: any;
//   public translatedWord;
//   public counter: number = 0;
//   public deckId: any;
//   public nativeLang;
//   public learnLang;
//   public cards: Array<object>;

//   constructor(
//     public navParams: NavParams,
//     public navCtrl: NavController,
//     private camera: Camera,
//     private alertCtrl: AlertController,
//     private loadingCtrl: LoadingController,
//     private http: Http,
//     private config: Config,
//     public translateService: TranslateService,
//     private oauthService: OAuthService,
//     public languageService: LanguageService,
//     public cameraService: CameraService,
//     public deckService: DeckService) {
//     oauthService.getProfile().toPromise()
//       .then(profile => {
//         this.profile = profile;
//         translateService.use(languageService.translateLang(this.profile.nativeLang));
//         this.cameraService.languages(this.languageService.translateLang(this.profile.nativeLang), this.languageService.translateLang(this.profile.learnLang))
// <<<<<<< HEAD
//         this.nativeLang = this.languageService.translateLang(this.profile.nativeLang)
//         this.learnLang = this.languageService.translateLang(this.profile.learnLang)
//     })
// =======

//         this.nativeLang = languageService.translateLang(this.profile.nativeLang);
//         this.learnLang = languageService.translateLang(this.profile.learnLang);
//       })
// >>>>>>> (bugfix) Fix add card button, add cards needs refactor to redirect
//       .catch(err => {
//         console.log("Error" + JSON.stringify(err))
//       });
//     this.http = http;
// <<<<<<< HEAD
// =======
//     // this.nativeLang = languageService.translateLang(this.profile.nativeLang);
//     // this.learnLang = languageService.translateLang(this.profile.learnLang);
// >>>>>>> (bugfix) Fix add card button, add cards needs refactor to redirect
//     if (this.deckService.deckCreation().length > 0) {
//       this.cards = this.deckService.deckCreation().reverse();
//       let cards = this.deckService.deckCreation().map(card => {
//         // looking for wordMap if it has wordMap change it to word
//         console.log('JSON.stringify(card)')
//         console.log(JSON.stringify(card['word']))
//         console.log('JSON.stringify(card)')
//       }).reverse();
//     }
//     this.title = this.deckService.currentDeck[0].name;
// <<<<<<< HEAD
//     this.deckId = this.deckService.editDeckId;
// =======
//     this.deckId = this.deckService.currentDeck[0].id;
//     // this.title = this.navParams.data.deckName;
//     // this.deckId = this.navParams.data.deckId;
//     // this.deckService.deckId = this.deckId;
// >>>>>>> (bugfix) Fix add card button, add cards needs refactor to redirect
//   }
//   ngOnInit() {
//     this.photos = [];
//   }

//   findCard() {
//     if (this.title) {
//       console.log('Find card click success:');
//       this.navCtrl.setRoot(FindCardPage, { findAdd: true });
//     } else {
//       let confirm = this.alertCtrl.create({
//         title: `Looks like you didn't add a deck name... You're gonna have to do that first.`,
//         message: '',
//         buttons: [
//           {
//             text: 'Oh...got it. ',
//             handler: () => {
//             }
//           },
//         ]
//       });
//       confirm.present();
//     }
//   }
//   ionViewDidLoad() {
//     console.log('ionViewDidLoad EditDeckAddPage');
//   }
//   createDeck() {
//     this.deckService.clearDeckCreation();
//     this.cameraService.deleteTitle();
//     this.navCtrl.setRoot(MyDecksPage);
//   }

//   picture(location) {
//     if (this.title) {
//       if (location === "Camera") {
//         var type = this.camera.PictureSourceType.CAMERA;
//       } else {
//         var type = this.camera.PictureSourceType.PHOTOLIBRARY;
//       }
//       const options: CameraOptions = {
//         quality: 100,
//         targetWidth: 300,
//         targetHeight: 300,
//         correctOrientation: true,
//         destinationType: this.camera.DestinationType.DATA_URL,
//         encodingType: this.camera.EncodingType.JPEG,
//         mediaType: this.camera.MediaType.PICTURE,
//         sourceType: type,
//       }
//       this.camera.getPicture(options).then((imageData) => {
//         imageData = imageData.replace(/\r?\n|\r/g, "");
//         this.base64Image = 'data:image/jpeg;base64,' + imageData;
//         var newForm = new FormData();
//         newForm.append("file", this.base64Image);
//         newForm.append("upload_preset", this.config.cloudinary.uploadPreset);
//         this.photos.push({ image: this.base64Image });
//         this.photos.reverse();
//         return newForm;
//       }).then(imgFormatted => {
//         this.cameraService.sendPic(imgFormatted)
//         this.cameraService.showLoading(5000);
//         setTimeout(() => {
//           this.fourN = this.cameraService.getWord();
//           this.cameraService.getTranslation(this.fourN)
//           this.photos[this.counter]['word'] = this.fourN;
//           this.deckService.addToDeckCreation(this.photos[this.counter])
//           this.navCtrl.setRoot(CardPage, { findAdd: true })
//         }, 3000)
//       })
//     } else {
//       let confirm = this.alertCtrl.create({
//         title: `Looks like you didn't add a deck name... You're gonna have to do that first.`,
//         message: '',
//         buttons: [
//           {
//             text: 'Oh...got it. ',
//             handler: () => {
//             }
//           },
//         ]
//       });
//       confirm.present();
//     }
//   }
// }
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Nav, AlertController, NavParams, LoadingController } from 'ionic-angular';
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
@IonicPage()
@Component({
  selector: 'page-edit-deck-add',
  templateUrl: 'edit-deck-add.html',
})
export class EditDeckAddPage {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = EditDeckAddPage;
  public photos: any;
  public base64Image: string;
  public picUrl: string;
  public profile: any;
  public fourN: any;
  public title: any;
  public translatedWord;
  public counter: number = 0;
  public deckId: any;
  public nativeLang;
  public learnLang;
  public cards: Array<object>;
  constructor(
    public navParams: NavParams,
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
        this.nativeLang = this.languageService.translateLang(this.profile.nativeLang)
        this.learnLang = this.languageService.translateLang(this.profile.learnLang)
    })
      .catch(err => {
        console.log("Error" + JSON.stringify(err))
      });
    this.http = http;
    if (this.deckService.deckCreation().length > 0) {
      this.cards = this.deckService.deckCreation().reverse();
      let cards = this.deckService.deckCreation().map(card => {
        // looking for wordMap if it has wordMap change it to word
        console.log('JSON.stringify(card)')
        console.log(JSON.stringify(card['word']))
        console.log('JSON.stringify(card)')
      }).reverse();
    }
    this.title = this.deckService.currentDeck[0].name;
    this.deckId = this.deckService.editDeckId;
  }
  ngOnInit() {
    this.photos = [];
  }
  findCard() {
    if (this.title) {
      console.log('Find card click success:');
      this.navCtrl.setRoot(FindCardPage, {findAdd:true});
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad EditDeckAddPage');
  }
  createDeck() {
    this.deckService.clearDeckCreation();
    this.cameraService.deleteTitle();
    this.navCtrl.setRoot(MyDecksPage);
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
          this.deckService.addToDeckCreation(this.photos[this.counter])
          this.navCtrl.setRoot(CardPage, {findAdd:true})
        }, 3000)
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