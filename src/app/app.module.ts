import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { Camera } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';

// import { Ng2CloudinaryModule } from './../ng2-cloudinary';
// import { FileUploadModule } from 'ng2-file-upload';
// import { Demo } from './demo.component';
// import { CloudinaryModule, CloudinaryConfiguration, provideCloudinary } from '@cloudinary/angular-4.x';
// import { Cloudinary } from 'cloudinary-core';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CreateDeckPage } from '../pages/create-deck/create-deck';
import { FindAddDeckPage } from '../pages/find-add-deck/find-add-deck';
import { MyDecksPage } from '../pages/my-decks/my-decks';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { OAuthModule } from '../pages/oauth/oauth.module';
import { Config } from '../config';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CreateDeckPage,
    FindAddDeckPage,
    MyDecksPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    OAuthModule,
    // Ng2CloudinaryModule,
    // FileUploadModule,
    // CloudinaryModule.forRoot({Cloudinary}, { cloud_name: 'your_cloud_name' } as CloudinaryConfiguration),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CreateDeckPage,
    FindAddDeckPage,
    MyDecksPage
  ],
  providers: [
    Config,
    StatusBar,
    SplashScreen,
    Camera,
    Storage,
    // Cloudinary,
    // provideCloudinary(require('cloudinary-core'), { cloud_name: 'dvlztondd' } as CloudinaryConfiguration),
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
