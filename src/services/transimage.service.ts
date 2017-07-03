import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { AlertController, LoadingController } from 'ionic-angular';
import { Config } from '../config';
​
@Injectable()
export class TransImageService {
 translationUpdate: EventEmitter<string> = new EventEmitter();
 public googleReq: any;
 public picUrl: any;
 public word: any;
 public wordMap: any;
 public translation: any;
 public source: any;
 public target: any;
 public nativeLang: string;
 public learnLang: string;
 public nativeWord: string;

 constructor(public http: Http,
  public alertCtrl: AlertController, 
  public loadingCtrl: LoadingController,
  public config: Config) {
  this.http = http;
  this.alertCtrl = alertCtrl;
  this.loadingCtrl = loadingCtrl;
​
 }

 setLearnAndNativeLangs(nativeLang, learnLang) {
   this.nativeLang = nativeLang;
   this.learnLang = learnLang;
 }
​
  showLoading(wait) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait... Learning takes time.'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, wait);
  }
  
  sendPic(form) {
      this.word = ""
      this.nativeWord = ""
    return this.http.post(`https://api.cloudinary.com/v1_1/${this.config.cloudinary.cloudId}/image/upload`, form)
    .map(info => {
      this.picUrl = info.json().url;
      return this.picUrl;
    }).toPromise()
    .then((url) => {
      return this.getGoogle(url, this.nativeLang, this.learnLang)
    })
    .then((word) => {
      this.word = word
    })
    .catch(err => {
      console.log('error from map:', JSON.stringify(err));
    });
  }
 
  getGoogle(imgUrl, nativeLang, learnLang) {
  return this.http.post(`${this.config.serverUrl}/googleocr`, { url: imgUrl })
    .map(res => res)
    .subscribe(data => {
    this.word = data['_body'];
    this.nativeWord = data['_body'];
    return this.googleWord(this.word, this.nativeLang, this.learnLang);
    
  })
  , err => {
    console.error(err);
  }

  }
​  
  googleWord(word, source, target) {
   let tranlationData = {
    "q": word,
    "source": source,
    "target": target,
   }
    return this.http.post(`${this.config.serverUrl}/googletranslate/sentence`, tranlationData)
      .map(translate => {
        this.word = JSON.parse(translate['_body']).data.translations[0].translatedText;
        return this.word;
      })
      .subscribe(resp => {
        this.word = resp;
        return this.word;
      })
  }

  returnWord(word) {
    return word;
  }
​
  getWord() {
   return this.word;
  }

  getNativeWord() {
    return this.nativeWord;
  }
​
  getTranslation(word) {
   this.googleWord(word, this.nativeLang, this.learnLang)
   
   this.translation = this.wordMap[this.target];

   return this.translation;
  }
​
​   getTranslatedWord() {
    this.translation = this.wordMap[this.target]
    return this.translation;
  }
  languages(source, target) {
    this.source = source;
    this.target = target;
  }
}