import { Component, ViewChild } from '@angular/core';
import { ModalController, NavController, NavParams, Nav, AlertController, Slides } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { OAuthService } from '../oauth/oauth.service';
import { DeckService } from '../../services/deck.service';
import { AnswerService } from '../../services/answer.service';
import { PhraseModalPage } from '../phrase-modal/phrase-modal';
import { QuizPage } from '../quiz/quiz';
import { FontAwesome } from 'font-awesome';
import { TextToSpeech } from '@ionic-native/text-to-speech';

@Component({
  selector: 'page-card-viewer',
  templateUrl: 'card-viewer.html',
})
export class CardViewerPage {
  @ViewChild(Nav) nav: Nav;
  @ViewChild(Slides) slides: Slides;

  public rootPage: any = CardViewerPage;
  public profile: any;
  public deck: Array<any>;
  public word: any;
  public wordsLanguages: any;
  public wordsTranslations: any;
  public deckId: number;
  public deckTitle: string;
  public deckLanguage: any;
  public index: any = 0;
  public langIndex: number = 0;

  constructor(public navCtrl: NavController,
    public translateService: TranslateService,
    public languageService: LanguageService,
    private oauthService: OAuthService,
    public deckService: DeckService, 
    public modalCtrl: ModalController, 
    private answerService: AnswerService,
    private textToSpeech: TextToSpeech,
    private alertCtrl: AlertController) {
    oauthService.getProfile().toPromise()
        .then(profile => {
          console.log(profile, 'profile')
          this.profile = profile;
          translateService.use(languageService.translateLang(this.profile.nativeLang));
          this.deck = this.deckService.getCurrentDeck();
          this.deckId = this.deck[0].id;
          this.deckTitle = this.deck[0].name
          this.deck = this.deck[0].cards

          if (!JSON.parse(this.deck[0].wordMap)["sorry"]) {
            this.deckLanguage = this.profile.learnLang;
          }

          this.translations();
        })
        .catch(err => {
          console.log("Error" + JSON.stringify(err))
        }); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CardViewerPage');
  }

  translations() {
    this.wordsLanguages = [this.languageService.translateLang(this.profile.nativeLang), this.languageService.translateLang(this.profile.learnLang)];
    this.wordsTranslations = JSON.parse(this.deck[0].wordMap);
    if (this.wordsTranslations['sorry']) {
      this.wordsLanguages = ['sorry', 'reallSorry'];
    }
    this.word = this.wordsTranslations[this.wordsLanguages[0]];
  }

  slideChanged() {
    this.index = this.slides.getActiveIndex();
    if (this.index < 0) {
      this.slides.lockSwipeToPrev(true)
      this.index = 0;
    } else if (this.index > this.deck.length - 1) {
      this.slides.lockSwipeToNext(true)
      this.index = this.deck.length - 1;
    }
    if (this.index > 0 || this.index < this.deck.length - 1) {
      this.langIndex = 0;
      this.wordsTranslations = JSON.parse(this.deck[this.index].wordMap)
      this.word = this.wordsTranslations[this.wordsLanguages[0]];
    }
  }
  swipeLeftEvent(index) {
    if (index < this.deck.length - 1) {
      this.slides.lockSwipeToNext(false)
    }
  }
  swipeRightEvent(index) {
    if (index > 0) {
      this.slides.lockSwipeToPrev(false)
    }
  }
  flip(index) {
    if (this.word === this.wordsTranslations[this.wordsLanguages[0]]){
      this.word = this.wordsTranslations[this.wordsLanguages[1]];
      this.langIndex = 1;
      return;
    } else if (this.word === this.wordsTranslations[this.wordsLanguages[1]]){
      this.word = this.wordsTranslations[this.wordsLanguages[0]];
      this.langIndex = 0;
      return;
    }
  }
  thumbsUp() {
    this.answerService.cardAnswer(this.deckId, this.deck[this.index].id, 'good')
  }
  thumbsMiddle() {
    this.answerService.cardAnswer(this.deckId, this.deck[this.index].id, 'ok')

  }
  thumbsDown() {
    this.answerService.cardAnswer(this.deckId, this.deck[this.index].id, 'bad')
  }
  presentPhraseModal() {
   let profileModal = this.modalCtrl.create(PhraseModalPage, { word:  JSON.parse(this.deck[this.index].wordMap)['en']});
   profileModal.present();
 }
  takeAQuiz() {
    if (this.deck.length < 5) {
      let sorry = this.alertCtrl.create({
        title: 'Sorry, Quizzes are only avaibable for decks with 5 or more cards.',
        message: '',
        buttons: [ 
          {
            text: 'Close. ',
            handler: () => {
            }
          },
         ]
      });
      sorry.present();
    } else {
      this.navCtrl.setRoot(QuizPage, { deck: this.deckId})
    }
  }
  async sayText() {
    let langObj = {
      en: 'en-US',
      fr: 'fr-FR',
      es: 'es-ES',
      de: 'de-DE',
      ja: 'ja-JP',
      ru: 'ru-RU',
    }

    try {
      await this.textToSpeech.speak({ text: this.word, locale: langObj[this.wordsLanguages[this.langIndex]], rate: 1 });
      console.log(`Succesfully spoke ${this.word}`)
    } catch (error) {
      console.error(error);
    }
  }
}
