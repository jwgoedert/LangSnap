import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { Config } from '../config';

@Injectable()
export class CameraService {
 translationUpdate: EventEmitter<string> = new EventEmitter();
 private serverUrl = `https://vision.googleapis.com/v1/images:annotate?key=${this.config.googleKey}`;
 public googleReq: any;
 public picUrl: any;
 public word: any;
 public title: any;
 public translation: any;
 public source: any;
 public target: any;
​ 
 constructor(public http: Http,
  public alertCtrl: AlertController, 
  public config: Config) {
  this.http = http;
  this.alertCtrl = alertCtrl;
​
 }
​
 sendPic(form) {
  console.log('inside send pic')
  console.log(form)
  console.log(JSON.stringify(form))
  console.log('look above')
  return this.http.post(`https://api.cloudinary.com/v1_1/${this.config.cloudinary.cloudId}/image/upload`, form)
   .map(info => {
    this.picUrl = info.json().url;
    console.log(this.picUrl);
    return this.picUrl;
   }).toPromise()
   .then(url => {
    return this.getGoogle(url)
   })
   .then((word) => {
    this.word = word
    // setTimeout(() => {
    //  this.getTranslation()
    // }, 1500)
   })
   // .then( word => {
   //  console.log(word)
   //  console.log('word')
   //  this.getTranslation()
   // })
   .catch(err => {
    console.log('error from map:', JSON.stringify(err));
   });
 }
 
  getGoogle(imgUrl) {
  this.googleReq = {
   "requests": [{
    "image": { "source": { "imageUri": imgUrl } }, "features":
     [{ "type": "LABEL_DETECTION", "maxResults": 5 }]
   }]
  }
  return this.http.post(this.serverUrl, this.googleReq).map(res => res.json()).map(data => {
   return data.responses[0].labelAnnotations[0].description;
  })
  .subscribe(word => {
   this.word = word
    // var formError = this.alertCtrl.create({
    //  title: "Other Form",
    //  subTitle: JSON.stringify(word),
    //  buttons: ['close']
    // });
    // formError.present(formError);
   console.log(this.word)
   return this.word;
  }, err => console.log(err),
  () => {
   this.returnWord(this.word)
  });

  }

  returnWord(word) {
    console.log(word)
    console.log(Date())
    return word;
  }

  getWord() {
    return this.word;
  }

  getPic() {
    // use this.url to get picture from cloudinary
  }

  getTranslation(str) {
   console.log('in translation')
   console.log(this.getWord())
   console.log(this.source)
   console.log(this.target)
   console.log('in translation')

   let tranlationData = {
    "q": str,
    "source": this.source,
    "target": this.target
   }
   return this.http.post('http://52.14.252.211/v1/googletranslate/sentence', tranlationData)
   .map(translate => {
    this.translation = translate;
    // var formError = this.alertCtrl.create({
    //  title: "Translation",
    //  subTitle: JSON.stringify(translate),
    //  buttons: ['close']
    // });
    // formError.present(formError);
    console.log(this.translation)
    console.log("this.translation")
    // this.translationUpdate.emit(this.translation);
    return this.translation;
   })
   .subscribe(resp => {
    console.log('RESP', resp);
    console.log('RESP', JSON.stringify(resp));
    this.translation = JSON.parse(resp['_body']).data.translations[0].translatedText
    console.log('translation yea yea')
    console.log(this.translation)
    console.log('translation yea yea')
    return this.translation;
   })

  }

  addTitle(title) {
    this.title = title;
  }
  getTranslatedWord() {
    return this.translation;
  }
  languages(source, target) {
    this.source = source;
    this.target = target;
  }
  getCardInfo() {
    return {
      title: this.title,
      picture: this.picUrl,
      word: this.word,
      translation: this.translation

    }
  }
}