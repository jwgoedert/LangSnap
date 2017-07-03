import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Nav, Slides } from 'ionic-angular';

@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})
export class AboutUsPage {
  @ViewChild(Nav) nav: Nav;
  @ViewChild(Slides) slides: Slides;
  public backimg: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
     this.backimg = "http://www.iexpats.com/wp-content/uploads/2016/06/foreign-flags.jpg";
} 

}
