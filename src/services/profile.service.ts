import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { OAuthProfile } from '../pages/oauth/models/oauth-profile.model';

@Injectable()
export class ProfileService {
  public http: Http;
  public data: any;
  constructor(http: Http,
    public alertCtrl: AlertController) {
    this.http = http;
    this.alertCtrl = alertCtrl;
  }
	public checkUser(userName, source): Promise<OAuthProfile> {
    if (userName.split(' ').length === 3) {
      userName = [userName.split(' ')[0], userName.split(' ')[2]].join(' ');
    }
    return this.http.get(`http://52.14.252.211/v1/users/auth/${source}/${userName}`)
      .map(data => {
        this.data = data['_body'];
        if (this.data === "{}") {
          let user: OAuthProfile = {
            firstName: userName.split(' ')[0],
            lastName: userName.split(' ')[1],
            provider: 'facebook',
            id: -1,
            facebookUsername: userName,
            token: "",
            email: "",
            nativeLang: "",
            learnLang: "",
            created_at: "",
            updated_at: ""
          }
          return user;
        } else {
			    let user: OAuthProfile = {
            firstName: JSON.parse(data['_body']).firstName,
            lastName: JSON.parse(data['_body']).lastName,
            provider: 'facebook',
            id: JSON.parse(data['_body']).id,
            facebookUsername: JSON.parse(data['_body']).facebookUsername,
            token: JSON.parse(data['_body']).token,
            email: JSON.parse(data['_body']).email,
            nativeLang: JSON.parse(data['_body']).nativeLang,
            learnLang: JSON.parse(data['_body']).learnLang,
            created_at: JSON.parse(data['_body']).created_at,
            updated_at: JSON.parse(data['_body']).updated_at
          }
          return user;
        }
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
      .toPromise();
    }

    updateUser(user) {
      this.http.post('http://52.14.252.211/v1/users/findorcreate', user)
        .subscribe(data => {
          this.data = JSON.stringify(data);
          return data;
        }, error => {
          console.log(JSON.stringify(error.json()));
        });
    }
}