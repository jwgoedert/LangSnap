import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { MyDecksPage } from '../my-decks/my-decks';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Screenshot } from '@ionic-native/screenshot';

@Component({
  selector: 'page-quiz-results',
  templateUrl: 'quiz-results.html',
})
export class QuizResultsPage {
  public results: Array<any> = [];
  private score: number = 0;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private socialSharing: SocialSharing,
    private screenshot: Screenshot,
    public platform: Platform,
    private alertCtrl: AlertController) {
    this.results = navParams.get('images').map((image, index) => {
      let tempArr = navParams.get('solutions')[index]
      if (navParams.get('solutions')[0] === null) { tempArr.unshift("No Answer")}
  
      let tempObj = {
        image: image,
        results: tempArr
      }
      navParams.get('solutions')[index][0] === navParams.get('solutions')[index][1] ? tempObj['color'] = "green" : tempObj['color'] = "red"; 
      if (tempObj['color'] === 'green') { this.score += 10; }
      return tempObj;
    })
    this.congratulations(this.results.length);
  }

  facebookShare() {
    this.platform.ready().then(() => {
      this.screenshot.URI(80)
        .then((res) => {
            console.log(res);
            this.socialSharing.shareViaFacebook(null, res.URI, null)
              .then(() => {},
                () => {
                  alert('SocialSharing failed');
                });
          },
          () => {
            alert('Screenshot failed');
          });
    });
  }

  congratulations(num) {
    if (num === 10 && this.score >= 70 || num === 9 && this.score >= 70 || num === 8 && this.score >= 70 || num === 7 && this.score >= 70) {
      this.message();
    }
    if (num === 6 && this.score >= 50 || num === 5 && this.score >= 40) {
      this.message();
    }
  }

  message() {
    let confirm = this.alertCtrl.create({
        title: `Congratulations! You're doing a great job! Keep up the good work.`,
        message: 'Don\'t forget to share your progress with your friends!',
        buttons: [
          {
            text: 'Close',
            handler: () => {
            }
          },
        ]
      });
    confirm.present();
  }
  done() {
    this.navCtrl.setRoot(MyDecksPage);
  }
}
