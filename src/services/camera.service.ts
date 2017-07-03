import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { AlertController, LoadingController } from 'ionic-angular';
import { Config } from '../config';

@Injectable()
export class CameraService {
  translationUpdate: EventEmitter<string> = new EventEmitter();
  public googleReq: any;
  public picUrl: any;
  public word: any;
  public title: any;
  public translation: any;
  public source: any;
  public target: any;
  public loading: any;
  public wordMap: any;

  constructor(public http: Http,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public config: Config) {
    this.http = http;
    this.alertCtrl = alertCtrl;
    this.loadingCtrl = loadingCtrl;
  }

  // set native and learning languages 
  languages(source, target) {
    this.source = source;
    this.target = target;
  }

  // loading message
  showLoading(wait) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait... Learning takes time.'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, wait);
  }
  
  // send pic to cloudinary 
  sendPic(form) {
    return this.http.post(`https://api.cloudinary.com/v1_1/${this.config.cloudinary.cloudId}/image/upload`, form)
      .map(info => {
        this.picUrl = info.json().url;
        return this.picUrl;
      }).toPromise()
      .then(url => {
        return this.getGoogle(url)
      })
      .then((word) => {
        this.word = word
      })
      .catch(err => {
        console.log('error from map:', JSON.stringify(err));
      });
  }

  // sends off cloudinary url to google object recognition
  getGoogle(imgUrl) {
    this.googleReq = {
      "requests": [{
        "image": { "source": { "imageUri": imgUrl } }, "features":
        [{ "type": "LABEL_DETECTION", "maxResults": 5 }]
      }]
    }
    return this.http.post(`https://vision.googleapis.com/v1/images:annotate?key=${this.config.googleKey}`, this.googleReq).map(res => res.json()).map(data => {
      return data.responses[0].labelAnnotations[0].description;
    })
      .subscribe(word => {
        this.word = word
        return this.googleWord(this.word, 'en');
      }, err => console.log(err),
      () => {
        return this.word;
      });
  }

  // sends word from google object recognition to google translate
  googleWord(word, source) {
    let tranlationData = {
      "q": word,
      "source": source,
    }
    return this.http.post(`${this.config.serverUrl}/googletranslate/wordmap`, tranlationData)
      .map(translate => {
        this.word = JSON.parse(translate['_body'])[this.source];
        this.wordMap = JSON.parse(translate['_body']);
        return this.word;
      })
      .subscribe(resp => {
        this.word = resp;
        return this.word;
      })
  }

  // get translation word map 
  getTranslation(word) {
    this.googleWord(word, 'en')
    this.translation = this.wordMap[this.target];
    return this.translation;
  }

  // reuturn desired word
  getWord() {
    return this.word;
  }

  getTranslatedWord() {
    this.translation = this.wordMap[this.target]
    return this.translation;
  }

  // title add, get and delete
  addTitle(title) {
    this.title = title;
  }
  getTitle() {
    return this.title;
  }
  deleteTitle() {
    this.title = null;
  }

  // return all current card info
  getCardInfo() {
    return {
      title: this.title,
      picture: this.picUrl,
      word: this.word,
      translation: this.translation,
      wordMap: this.wordMap,
    }
  }
}
