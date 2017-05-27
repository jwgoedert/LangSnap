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
  public test: any;
  public picinfo: any;
  public picJson: any;

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
    this.http.get("http://52.10.42.22")
      .subscribe(data => {
        console.log('DATA', data);
        var alert = this.alertCtrl.create({
          title: "Success is a hello!",
          subTitle: JSON.stringify(data),
          buttons: ["close"]
        });
        alert.present(alert);
      }, error => {
        console.log(JSON.stringify(error.json()));
      });
  }

  makePostRequest() {
    // this.http.post("https://httpbin.org/post", "firstname=Nic")

    // this.http.post("http://localhost:3000/v2/", { "something": "something" })
    // this.data = this.data || "something";
    // this.http.post("http://6077fc18.ngrok.io/v2/", { "something": ` ${this.data}` })
    //   .subscribe(data => {

    //     var alert = this.alertCtrl.create({
    //       title: "Data String",
    //       subTitle: data.json().data,
    //       buttons: ["close"]
    //     });
    //     alert.present(alert);
    //   }, error => {
    //     console.log(JSON.stringify(error.json()));
    //   });
  }
  takePhoto() {
    const options: CameraOptions = {
      quality: 30,
      targetWidth: 200,
      targetHeight: 200,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      // destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
    }
    console.log("TOTOPHOTOs");
    this.camera.getPicture(options).then((imageData) => {
      //add imageData to local storage
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:  
      // imageData = imageData.replace(/\s/gi, '+');
      imageData = imageData.replace(/\r?\n|\r/g, "");



      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      var newForm = new FormData();
      newForm.append("file", this.base64Image);
      newForm.append("upload_preset", "ugzxlhop");
      
      console.log('What is this?', this.base64Image, 'STORAGE', this.storage);
      this.picinfo = imageData;
      // this.test = {
      //   "file": "data:image/jpeg;base64,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", "upload_preset": "ugzxlhop"
      // }
      this.test = `{
         "file": "data:image/jpeg;base64, ${imageData}", "upload_preset": "ugzxlhop"
      }`;
      this.test = JSON.parse(JSON.stringify(this.test));
      // this.http.post("https://api.cloudinary.com/v1_1/dvlztondd/image/upload", this.test)
      // this.http.post("https://api.cloudinary.com/v1_1/dvlztondd/image/upload", this.test)
      this.http.post("https://api.cloudinary.com/v1_1/dvlztondd/image/upload", newForm)
        // this.http.post("http://6077fc18.ngrok.io/v2/", this.test)
        .subscribe(info => {
          this.data = JSON.stringify(info);
          var alert = this.alertCtrl.create({
            title: "Data String",
            subTitle: JSON.stringify(info),
            // subTitle: data.json().data,
            buttons: ["close"]
          });
          alert.present(alert);
        }, error => {
          var alertErr = this.alertCtrl.create({
            title: "ERROR",
            subTitle: JSON.stringify(error.json().error),
            buttons: ["close"]
          });
          alertErr.present(alertErr);
          // }
          // console.log(JSON.stringify(error.json()));
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






























// import { Component, ViewChild, Injectable } from '@angular/core';
// import { NavController, Nav, AlertController } from 'ionic-angular';//NavController
// import { HomePage } from '../home/home';
// import { Camera, CameraOptions } from '@ionic-native/camera';
// import { Storage } from '@ionic/storage';
// import { Http } from '@angular/http'
// // import { Page, Alert } from 'ionic/ionic';
// // import { Cloudinary } from 'cloudinary-core';
// import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';

// @Injectable()
// @Component({
//   selector: 'page-create-deck',
//   templateUrl: 'create-deck.html',
//   //  template: '<cl-image public-id="image_id" cloud-name="myCloudName"></cl-image>',
// })
// export class CreateDeckPage {
//   @ViewChild(Nav) nav: Nav;

//   public imageId: string;
//   public photos: any;
//   public photonames: any;
//   public base64Image: string;
//   public data: string;
//   public test: any;

//   // uploader: CloudinaryUploader = new CloudinaryUploader(
//   //   new CloudinaryOptions({ cloudName: 'myCloudName', uploadPreset: 'myUnsignedPreset' })
//   // );


//   rootPage: any = HomePage;

//   constructor(
//     public navCtrl: NavController,
//     private camera: Camera,
//     private alertCtrl: AlertController,
//     private storage: Storage,
//     private http: Http,
//     // private cloudinary: Cloudinary,
//   ) {
//     this.http = http;
//     // this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
//     //   let res: any = JSON.parse(response);
//     //   this.imageId = res.public_id;
//     //   return { item, response, status, headers };
//     // };
//     //  this.cloudinary = cloudinary;
//   }
//   // upload() {
//   //   this.uploader.uploadAll();
//   // }
//   ngOnInit() {
//     this.photos = [];
//   }
//   makeGetRequest() {
//     this.http.get("http://52.10.42.22")
//       .subscribe(data => {
//         console.log('DATA', data);
//         var alert = this.alertCtrl.create({
//           title: "Success is a hello!",
//           subTitle: JSON.stringify(data),
//           buttons: ["close"]
//         });
//         alert.present(alert);
//       }, error => {
//         console.log(JSON.stringify(error.json()));
//       });
//   }

//   makePostRequest() {
//     // this.http.post("https://httpbin.org/post", "firstname=Nic")

//     // this.http.post("http://localhost:3000/v2/", { "something": "something" })
//     this.http.post("http://d96ae51a.ngrok.io/v2/", { "something": "something" })
//       .subscribe(data => {
//         var alert = this.alertCtrl.create({
//           title: "Data String",
//           subTitle: data.json().data,
//           buttons: ["close"]
//         });
//         alert.present(alert);
//       }, error => {
//         console.log(JSON.stringify(error.json()));
//       });
//   }
//   takePhoto() {
//     const options: CameraOptions = {
//       quality: 10,
//       destinationType: this.camera.DestinationType.DATA_URL,
//       encodingType: this.camera.EncodingType.JPEG,
//       mediaType: this.camera.MediaType.PICTURE
//     }
//     console.log("TOTOPHOTOs");
//     this.camera.getPicture(options).then((imageData) => {
//       //add imageData to local storage
//       // imageData is either a base64 encoded string or a file URI
//       // If it's base64:  
//       imageData = imageData.replace(/\s+/gi, '+');

//       this.base64Image = 'data:image/jpeg;base64,' + imageData;
//       console.log('What is this?', this.base64Image, 'STORAGE', this.storage);






//       // this.test = {
//       //   "data": "image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUSEhIVFRUVFRUVFRUVFRUVFRUVFxUXFxUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGi0lHR8tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLS0tLf/AABEIAJ8BPgMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAADBAIFBgEAB//EADgQAAEDAQYCCQMEAgMAAwAAAAEAAhEDBAUSITFBUWEGEyJxgZGhsfDB0eEUIzJCUpJigvEHFXL/xAAZAQADAQEBAAAAAAAAAAAAAAABAgMEAAX/xAAjEQACAgMAAwADAAMAAAAAAAAAAQIRAxIhBDFBEyJRMkKB/9oADAMBAAIRAxEAPwDZtRWoDCisXbImkMMajYUKkUbEhuGgTghOci1HIDs06YrR7GpsKGGI1OkmAkTQ3BFLFAhCwtASV4FHDF0sTWILkqOJGc1DbRJOQJTWcSYSdAjCzvP9Sru7rMGjMHxAVgAFnefvCqxf0yzbFUP9T3pqnc7zrACvXPAQnWgcVKXlUMsIpZroa3N3a9k6ymG5AAIYtC4+uNyoTzbdbKrHQVzoUeuCWqWgaID6izyyfwooFg6ovYkga4gIraqH5LDoNtfKFUoB39RK62oiB6rHI19JtFDbbC6nnqOKTD1qjDhBEhVVsukEEs14FbcfkJ8kQli/gg16mHJN0tMHUKbKi0NE7HQuPQ2PUnFKOCc5QL116E4JkKdL1Bz1EqDymAcdUXm1Eu9ygHqc5UFIe6xc6xKGoodas27spQdr0QPSDKiI2qmcWTUiwp1ETrEnTci4kiscI568woBcuseq9FLGlTlHwJalVRxWXbMZEXIJ1U6tQJZ706YGMBy9KUNVdDyVQmMFWt3WUN7RS922ae0U7XqRusXkeRX6o04sX1jRqhdLwqui+Tse9I3xbXxAIj19lglmpWaFjt0WVrtewE9xn2S9KtGhPdr+VmbLTdOJzj/uAPKVc0qriI17zPkVJNy6yrio8LPrjy8ErXrRvltyKVrPLdfI/QqmtV4iSAUJzrgYws0HWz88lD9R6ZeqrLJWOEE8JXjX345/VTUrG1LAWnjxTFC2AwVnXV9fneiUrTOnDy4LtmFxRpaVrmTt7o4rzks82vEDlPzx9kxRqOjXxTqbEcDR0auyOBwVHZrQ3j9lZ0K42krRDJfshOFAbzu0PGIfy91nXAtMHVbMKrva7w8Ym6jUfhejhzV+rM04X1FNTejByWAI1Uw5aWTQZQcF4OXC9Cw0DcECojPel6jkHM6haoULEpvQnBTk7OOuchly4VBxU6CSJRKZUFNqvtwjQ3TcihyTDoXuuS62UsZc5R6xB6xRLkyiK2PUrQj9equm9MNKDjQUxkvQ3PUSowniBkwZyVvYbtmHOOXAJS7bJJkieCtq1TCMz4BZPJ8jXkS+HFfWHrVQwQFR2y2iYLvCdUC87eTIae8qloEudPH1XlTm5M9CEKRqbJXAZ65Kht9rxO7Iy59oemSnfV4ClRa0auE+G0BYqnfhLiSAI3Mlx8dl1OX/AAaMfpuaFaNcP+uE+6Oy82g4WwVgal7OcDgk+n1SL+lDaIh2N7+DDgaO+oe15DxVIQnLiQJRSVs3N9XmcJMZjPXZIXTVbVM8YIn5zXz6p0gqVJLQ1gGznudPi4J24r6c1oG4JjPTPRPk8WUVszoTi/1R9LfWAEDgla1WI8lSWW9HOiR8+QnH1cvnisdNMpqHDpB5mJ9yj2bUjTj3Db0SFN5EAcvyj0qnrn4Lg0WtHd3l9PZc/XGYKFY3ZBVt5Ym1J4lJbAkaWif7ADvcVYWW3jR0eBWbsNpfGo8U1+oaczE88X0CopP4I42bSz1wQjtA2WZu+8Rl2hwyM/RX1GsDutmLLfGZcmOidexMfqM+KWNzs2JTRfzXW1FqWb4R1M/b7Gafcq11RaG+oLSso+onjkbFlGgj6iEXoT6iGaiN2KGcUJ5QzVUMaKOOuKC8qZchPKdM4aC6otKkXJNxdTjioxK6SpsVI5UDU8xinhU2hShB5jtAbBCOxyEVHFCDyIKVDYciUiJzEpAVUVtZLKfApGis1cAZCFV3vbDMTEpiwO7JOwVHb681MRPILy80rdHoYV9AW6pA11+FRuoF1QNJgO1G+EZ+3uqu9Lb22AaSJ7t/ZXl25Oed4dnyjKPP0Uki7VIqr9r9ZUcdhk0bADRZu6LsNas4/wBWnjElXVtqxTc/jJz2CP0Ra0UwdHOJdJ3lPBtRbDJ0MC7msyA+yznSi4GntMG2Y+xW8e8GARnsQJSdWmXZR5hGE3CWyEf7KmfI2XVWEgAwdcvdXtzXQ4QYyW8s/R/Ge0MpmFcUrlY0bq2XypSVULCEYOzKWKwwJITHV5xHz4FoatmEQAlf0w4LFfS2xSk5z81ULRaMPzgrc2Lgqq8bNGy5hVHbNfTQM9fkIFe9Q5wblPAbciVk79tfVnLUQPHY92nkq+77xfSIfJdJ7QAhwzz1yPmtcPEc4WTlkhGVH2K62CPuuWyjgORjl+FTXNe7XsBxS1wljxoY1BH9XA5EK4NpxNGY8dFGq/UHfYq2rBnzhaqw1ZYCDIWQqVBwH/V3sra7rZhZrl5R3jVTXJHSVo0lOt81TFMqkq2mWyD4qV3W0kwSfnqrrIRcOFleNAuaYhYy0tLSZW2qjENYWOvak4Ozz55rTGRCaEHPUC5elSCr+ZIlqRlcARQ1cLV35kMokYQqgRCUF5U/zHahhVXHVErjUDUTNsWhsVUelVVY2ojMelthotBUXTUlIioptqIoFDYch1VBtVdc8KcpMFEIUmuXA6VNrU8ZWBotrPXHVloWUveo4vDR/kNFdUCZSFrqtYS4jNZM0dZm/wAaVxKc0TjAdp/IjgBnM7bBaCiHdS+oNX9lo3gDMrO//bh1QMwgYnAcydpPDktVbXDCwDQN8p+SldpF5ezG3893UmP4gBg/5OcQMvMlavo9Y3imzEIyGQgflZW0W0GtSY8dlpxDPCSWjU8dfytM2+DHZIjj9+CZ8ikdJM0XVAax3DI+a5TptJyH1WYN7kmGmSTE81qLspw3E7MnjulEaofpsgcPnFL1q7Rv6ykrwe8mceX+I081XVq7W6nNTlK/QYxLYkOXhQBWZfazOTk5ZLc45Eqe1e0Pr/C7FKEC8LCHN0UqNp0Dh4wmn8Nk6E9HybpDdRe9wAk+azxu+pOEe2YX1a9LEHPxRmNeY2KA2xNBlzc+5bcXlOEdaBPHGTsxFy3ZaKQc0Ehr889A4aOA7lo7ptrmyx+o9VfdUDkBl6Kvva6jGJuo4KOTJ+R2x4UlR4uJziRuCp1rQWODSDBzkEZfj8hJWWsQIOq5ZrRjfxG3fOYPz6qVfRqNe137Yg9x0PMLl22kEw7Jw9eYSVoq4acaEfB3ZJU1ZIcNd+a6+CVZvbO6Qqe/KBj+J8Au3PbZAlXVRrXiCFeEtkZ5xpnzetWgxp3qArK16Q3ZTaS7rHDvH1Wa6zPIym1b9Gd8LZlRedUSVKopuekpo6ydSqgmqgVaiAaiZQbOsYxLhcohy9C30gHQ5GY5BDURgSuIQ4ciByCFKUjicwheudYhr0JXARh21ExSqqtJRqLkKoBfUGCFQ9IWYWud5K1s9bJAvCkKgjnPqpZlav8Ahp8eWsqM/ctxZtL/AOTnYleX/UDG4B/+fTP7eKrqVuc2sI0bl88lHpI/tNknNxyGp7vJRbcjb9Mbe9Y9a3Qho0OmZzg6hP0ToWlzT4x/sM/RR/Q1HuloazPfN/sXDyCsf0rAO1apI1AIPriK0tcQLpmj6MWYPz6sDDq4RnygfhaG11HAdkx9EC4KFNtnD2PkO7Ukgz4otoIjUElZZiXbMhabzqsr4XOxBwOR0B2M8EWhaaJn9wOduSRE8hwVT00wtLg0fuObkZgCNhzKwNO1ua7dep4uGCgpNezNmnJukfW20abjkc+R+iiappr55Z75qNMhxCv7v6TB8B3HM8VXJ4+KaJxyZIm+s9sD2gifynbLayew4ZxkVhqF+Fp6qmwudikcMJ5rZWSuSwF4ErxcmN450bovaNnbQ3tTlIy7x3KJsUwQckG8H5jiJjmFO7LxacilD2gxp4RnHshCo05f+KzNJjxISFpoBuencjQqZkekzerzAjPb7INyU4e3mR75qXS62fxblm4cxqi3eIqM7/p/55KklUCkWaW3UcQIGsR3wqdoI8Fc3k7CZH9h5EKiFeXQd1JnRNFdtSIlaBtcxlmstY60Qr6zPOGQjAnkRT9Izj4+iyYZBWqvqq2q1wgB4HnyWWbK2QfDFk9h2lec5DxL2JK0JQOol3pl4QHBViEKxHaEm2oj06iu0cMNapAKLXKeJLYxIBdhcaiAINgOALuBdAU11nUCLFOnTXQUQPC5nUdxQhsqw4cDkfFdc9Dy3z4D78kjgcuOxW12Qh2PYGSOMcPvoqu/LfiLSDDYzdy3aOJOkHLllK1lns7XiCddZ07/AMKto9GRaKwoUweqpuxVapHZE/1aDq4jwGqz6ayRtx5LVszlOhUexgPYY7tACSXA6E/5GOOXCEZtgphuojl2yTwEZHwDgN4Wv6XXc0CGgZCI4gaAnhl4rJ06ORnM6aQTy4Af8dBvwRcq9jxeyNhc1Zhs9PAYDRhP8dRqDGU9yJabWOfj9lkrnvHq3FryAwmGnYO/xZx5nQcspt7S4k7ct8uJUproKMz0pYariJIkdmZPaGgA2WLtGPEQ/I6Ed3uvoF7UZEZ667j8rN267y7sjNwBwjLYTErf4+Wo6shkx30o6UOkHQpuwWHtQHiOQOffwRad2wIOemY2+60fR+7Ax2LXgrTzxghI4mzS9H7sa1gdhgkDvV/SeBkkbNUyhMUWEmZheNkm5ys1JUqCWuiHtiQHDMFUtd4H/Fw1kEe0q/tNLsxOe0/QrNWm1tD8GAujXb390Bolldd5nQ57SDPmjXzeADdu46quoWYNGMeW/dzVBfN645G42IyP2KMIth1TZV3pautr0wJHbE8NZWlZkWEahwPgspdzMVYcpPofuthY2y8HgM/RVzcSQUqZeXhUBEcFnWvBdlsYnwz+itL4BzA3Cp6dAtB8YUTolpZq0j/stNZH/tcwFj7vaclf2i04KR7l0f8AIXJxFXarScZ8Uoaag2riMlMtC3RVI81u2LmiuFiaeEJwSsIs8IJamHoQTI4qQ9Ho1ClmpmgFrfo4fovRS5L01N6h9CgvWqTaySdUXWVFXU4sRVXetSQqKXWJdQDRqLnWJcOU6Ykwuo4k0kmAm7HYqj3ZggHfZOXHcz3VA6Oz8yW+s1gYwQAlYUUt2XFhg6qzdXDewxogHPKM+PNMV7S1gMZL5iOmdRtUsd2sToEQNXQB7LV4fj/lU5RV0SzZVBxT5ZoulNMOGWR47hYCi4ioQdDkOQ4LX3hag55pAyWxPMxPks5eFnAcDEZzK8vLyTPRxeiivaA8uP8AUdnhO3dmZVTSvmux0YyZI1z1+FaW+qGI8lQ3bdQrVjiOFjBUIjV7mZjXaSweccVo8ZKUehyuqoHXvivinEd/MpC0XjUcZcTltsVYWqz5lIV6OS0RjFfBpwZcXXedJzQ2pk6RmNFqLsDSJaQRkJB4/AsBRsROiv7soOohzy/C3s6+Qy45rPmxJrjDGDrptqXfprzT1Ajj3LEUukzg6A2QTAJ10GZ8SvU71rV+ySW5/wBZ8M+8eqxPDKPs5K/RoL+vUv8A2mfx/i9zf5MO0cR7rtiaGMa2pBgdl/51j29EpQox2o1/kNO/yOa9e1QYAAcgY7uB7kt3xDV8I3nbSD1egOX2+iz+F1Qw4E8/7Dx3HI+itLJTLwGu1aYH0HuFrrk6Nh7JBz3B9wU6dcRzkorpiqN3GkA47yAfCVo7mpYpPz5kh9J6BoljCP7fTIjmnejzYHzw9EuS/oNtlYhettc15afD0I91Gja8TcxyP3Tl9UBicTy9tEhZrKS4Rupukh49RcWKzCJ2Gaq71rueeAGg+qsrXUwtDB4qsrjJXww+mHyJ29UJ0XZp5lRVoOaapuWhmdIac9Bc9eJUSErGoG9RARIXg1GwlFTTVEoPVQmKDM1q2VCjlNefmpNapFqhfQ0LOYo4E1hUC1UUwAl3EpFqi5kJlI4JTctDctgNRwLQHDcbhZkA7Bb/AKEWAhvWOaWn38EZHI09gsgptj3RTUCXtVphVdotfOFnnlS9FIwbH7wcxzSCBovlzei7RUrV7Q/9um1zmNDgwufnEu2a3XnktnUfUqA4BMQPE6BUXSq7XP6inVq0qbGuc6qC9pOLZopgy46ZclXxvKyw204mugyYYSrb2imsV9uqMNJzR+3UqHrMi+q4uxQXRnAcB5JqozrGzGqcq2GmKXYZhaGuFFhiZJl9WrxceGgSFlquAwZcySJ8fsoZaZeHPQGpZ5bEclWNqhxcOrDCxrWDD/bFiJeeJOEd2a0tnw5tO/h8Cz15/tVw4/xqQw8Af6nzy7iUvjT1k4/0sknJN/BK12adBskKtiOXetJUooNamIW41CV22LPRKdJ3ONYU9GMDY4Yy0OMjuK0NipZhK3vdTnWhzyThwMgTvAmBtolnJRVslmVpJFBYrK4uAOQHBae7btDRn5oVms7WjE4xG5Qbwvr+lPmCeWmXjK8yUpZHS9HPnEHvK8w3JucQTzEkEKs/VzvkRn5x9En1czl8kE+spinZchkfhKprGKAjQ3Q4GJ7vt7ei3tw2gNjOV82sJw8fFa24rRmpKVSJ5I2hj/5TpfsUqoH8aoBPItIE+MKouGpLI7/UrU9ILEbTZKtEfyLcTObmkOaPGI8Vh+jFV2AtIMtdhIOREayNoTZndMGL/Ci0vaialVo4AT3nVEqVmUsm9p3oFOsSJA1OZP2SnULseK/2kTyZf9YgSSczuhV00aaHUYtO1GWir6rNFptR3NUSg5WceIUSuOeoY0oyJLqjKiXrmGhd1NSpNXUVjV0ZMVEmhdcF0BdCaxqPQuYVJSAXJiNA8CE4AmEchXVy3Oyr37qkQFj0Su6icyJ5Hitm4gCBkFV3fczKWe/eiWyuRomlKl0ZKwFvqLOW61bbp613kd1SWm3A54c1gm7ZqgqOWS1VBUJwEtpU3VGgH+VUnDSaBu5z3D/VLXJ0Y/Tk1bSG1LSe0KRIwsnPHUO55BXNw1cNN1aBliqAcS09VSB/7ue7wCy9Lpc6ra3MADgCGl5EOcdzyE7LdG1iX9Jdc2l6Lu1dY6S8CTwcD4aKjfTIOQ8yMlc22sN1Ww06wfArC+uzRHiFKtowHFik/NOala6lOuyDk7cH6Ild1MbKntLhPZJz4BcotjIfsjwOy7bc7+KYdSB/CpH1XNylcp2vPTVaI5ppdVl1M09BjW5pW8LxaMzmeA9FRuvN0Rp3clClhcRMyRHhOR80mSUp+/QknZ601TV1yGzY+T+UWz2dmwz2MaorKbv8WkcyUwxrtIA9fqpt8oFizAJ0+ica2ctgiUmTqB88U5Tsx2SNgbFbNTAOTZPHdXN3CCNkFlCdU5ZqO0oCtmosNXKEvbejzS816OT3Z1Gz2amWuf8AF3ofVLWR2HKfBXdltg0KqnGSpkHcXaMpXouGoI5HVKvctreF3MqDEBmsdeVkcw/lXSpEm76Kvcl6j0OpVS1SqkkKFfUQXVEB9RQLlyRwV1RC6xDc9Be9UUQob61RdVSRqrjS52gT6BP/2Q==",
//       //   "upload_preset": "equot7ar"
//       // }
//       // // var headers = new Headers();
//       // //   headers.append('Content-Type', 'application/x-www-form-urlencoded');

//       // // this.http.post("https://api.cloudinary.com/v1_1/dbw25uhza/image/upload?upload_preset=equot7ar",  "file=https://sarahalexander.us/wp-content/uploads/2015/08/chicken-eggs-baby-chick-in-shell.jpg")
//       // // this.http.post("https://api.cloudinary.com/v1_1/dvlztondd/image/upload",  {"upload_preset":"ugzxlhop","file":"https://sarahalexander.us/wp-content/uploads/2015/08/chicken-eggs-baby-chick-in-shell.jpg"})
//       // // this.http.post("https://api.cloudinary.com/v1_1/dvlztondd/image/upload", { "file":  this.test, "upload_preset": "ugzxlhop" })
//       this.http.post("http://d96ae51a.ngrok.io/v2/", { "file": this.base64Image })

//         .subscribe(data => {
//           var alert = this.alertCtrl.create({
//             title: "Data String",
//             subTitle: data.json().data,
//             buttons: ["close"]
//           });
//           alert.present(alert);
//         }, error => {
//           var alertErr = this.alertCtrl.create({
//             title: "ERROR",
//             subTitle: JSON.stringify(error.json().error),
//             buttons: ["close"]
//           });
//           alertErr.present(alertErr);
//           // }
//           // console.log(JSON.stringify(error.json()));
//         });


//       this.photos.push(this.base64Image);
//       this.photos.reverse();
//     }, (err) => {
//       // Handle error
//     });
//   }
//   deletePhoto(index) {
//     // this.photos.splice(index, 1);
//     let confirm = this.alertCtrl.create({
//       title: 'Sure you want to delete this photo?',
//       message: '',
//       buttons: [
//         {
//           text: 'No',
//           handler: () => {

//           }
//         },
//         {
//           text: 'Yes',
//           handler: () => {
//             this.photos.splice(index, 1);
//           }
//         }
//       ]
//     });
//     confirm.present();
//   }


//   ionViewDidLoad() {
//     console.log('ionViewDidLoad CreateDeckPage');
//   }

//   click() {
//     console.log('they gone think i won a grammy!!!!!!')
//   }
// }
