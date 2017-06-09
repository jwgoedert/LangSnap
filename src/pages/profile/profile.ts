import { Component, ViewChild } from '@angular/core';
import { Nav, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { ProfileService } from '../../services/profile.service'
import { OAuthService } from '../oauth/oauth.service';
import { LanguageService } from '../../services/language.service';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  @ViewChild(Nav) nav: Nav;

  public rootPage: any = ProfilePage;
  public chooseALang: Array<string>;
	public profile: any;

  constructor(oauthService: OAuthService,
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public translateService: TranslateService,
    public alertCtrl: AlertController,
    public profileServices: ProfileService,
    public languageService: LanguageService) {
      translateService.use('fr');
      this.chooseALang = [
        'English',
        'French',
        'Spanish',
        'Japanese',
        'Russian',
        'German'
      ];
      oauthService.getProfile().toPromise()
        .then(profile => {
          this.profile = profile;
          if (this.profile.nativeLang === "") {
            translateService.use("en");
          } else {
            translateService.use(languageService.translateLang(this.profile.nativeLang));
          }
        })
        .catch(err => {
          console.log("Error" + JSON.stringify(err))
        }); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  langForm(email, native, learning) {
    if (!email.includes("@") || !email.length || !native || !learning){ 
      var formError = this.alertCtrl.create({
        title: "Sorry",
        subTitle: "Please check your email, native language and learning lanugage again.",
        buttons: ['close']
      });
      formError.present(formError);
    } else {
      let user = {
        "facebookUsername": this.profile.facebookUsername,
        "email": email,
        "firstName": this.profile.firstName,
        "lastName": this.profile.lastName,
        "token": JSON.stringify(JSON.parse(localStorage.getItem('oauthToken')).accessToken),
        "nativeLang": native,
        "learnLang": learning
      }
      this.profileServices.updateUser(user)
      this.navCtrl.setRoot(HomePage);
    }
  }
}
