import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AlertController } from 'ionic-angular';

@Injectable()
export class LanguageService {
  public http: Http;
  public languages: Array<string>;

  constructor(http: Http,
    public alertCtrl: AlertController) {
    this.http = http;
    this.alertCtrl = alertCtrl;
    this.languages = [
        'English',
        'French',
        'Spanish',
        'Japanese',
        'Russian',
        'German'
      ];
  }
  translateLang(lang) {
    let translateTo = [
        'en',
        'fr',
        'es',
        'ja',
        'ru',
        'de'
      ];
    return translateTo[this.languages.indexOf(lang)]
  }
}
