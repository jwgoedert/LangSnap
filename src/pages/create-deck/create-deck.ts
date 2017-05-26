import { Component, ViewChild, Injectable } from '@angular/core';
import { NavController, Nav, AlertController } from 'ionic-angular';//NavController
import { HomePage } from '../home/home';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http'
// import { Page, Alert } from 'ionic/ionic';
// import { Cloudinary } from 'cloudinary-core';
@Injectable()
@Component({
  selector: 'page-create-deck',
  templateUrl: 'create-deck.html',
})
export class CreateDeckPage {
  @ViewChild(Nav) nav: Nav;

  public photos: any;
  public photonames: any;
  public base64Image: string;
  public data: string;

  rootPage: any = HomePage;

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private alertCtrl: AlertController,
    private storage: Storage,
    private http: Http,
    // private cloudinary: Cloudinary,
  ) {
    this.http = http;

    //  this.cloudinary = cloudinary;
  }
  ngOnInit() {
    this.photos = [];
  }
  makeGetRequest() {
    this.http.get("https://httpbin.org/ip")
      .subscribe(data => {
        var alert = this.alertCtrl.create({
          title: "Success is a hello!",
          subTitle: data.json().origin,
          buttons: ["close"]
        });
        alert.present(alert);
      }, error => {
        console.log("ERROR", JSON.stringify(error.json()));
      });
  }

    makePostRequest() {
        this.http.post("https://httpbin.org/post", "firstname=Nic")
        .subscribe(data => {
            var alert = this.alertCtrl.create({
                title: "Data String",
                subTitle: data.json().data,
                buttons: ["close"]
            });
            alert.present(alert);
        }, error => {
            console.log(JSON.stringify(error.json()));
        });
    }
  takePhoto() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    console.log("TOTOPHOTOs");
    this.camera.getPicture(options).then((imageData) => {
      //add imageData to local storage
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:  

      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      console.log('What is this?', this.base64Image, 'STORAGE', this.storage);

      // this.http.post("https://api.cloudinary.com/v1_1/dbw25uhza/image/upload?upload_preset=equot7ar",  "file=https://sarahalexander.us/wp-content/uploads/2015/08/chicken-eggs-baby-chick-in-shell.jpg")
      this.http.post("https://api.cloudinary.com/v1_1/dvlztondd/image/upload",  {"upload_preset":"ugzxlhop","file":"https://sarahalexander.us/wp-content/uploads/2015/08/chicken-eggs-baby-chick-in-shell.jpg"})
        
        .subscribe(data => {
          var alert = this.alertCtrl.create({
            title: "Data String",
            subTitle: data.json().data,
            buttons: ["close"]
          });
          alert.present(alert);
        }, error => {
          console.log(JSON.stringify(error.json()));
        });


      this.photos.push(this.base64Image);
      this.photos.reverse();
    }, (err) => {
      // Handle error
    });
  }
  deletePhoto(index) {
    // this.photos.splice(index, 1);
    let confirm = this.alertCtrl.create({
      title: 'Sure you want to delete this photo?',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.photos.splice(index, 1);
          }
        }
      ]
    });
    confirm.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateDeckPage');
  }

  click() {
    console.log('they gone think i won a grammy!!!!!!')
  }
}
