import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CardViewerPage } from './card-viewer';

@NgModule({
  declarations: [
    CardViewerPage,
  ],
  imports: [
    IonicPageModule.forChild(CardViewerPage),
  ],
  exports: [
    CardViewerPage
  ]
})
export class CardViewerPageModule {}
