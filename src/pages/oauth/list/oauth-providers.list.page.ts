import { Component, ViewChild } from '@angular/core';
import { Nav } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { OAuthService } from '../oauth.service';
import { HomePage } from '../../home/home';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Component({
	templateUrl: 'oauth-providers.list.html',
	providers: [OAuthService]
})
export class OAuthProvidersListPage {
	@ViewChild(Nav) nav: Nav;
	private oauthService: OAuthService;
	public logo: string = "http://res.cloudinary.com/dvlztondd/image/upload/v1499280456/LangSnapLogoTest_suvj7j.png"; 
	rootPage: any = HomePage;

	constructor(oauthService: OAuthService, 
		public navCtrl: NavController, 
		public translateService: TranslateService ) {
			translateService.use('fr');
			this.oauthService = oauthService;
	}

	public login(source: string) {
		this.oauthService.login(source)
			.then(
				() => this.navCtrl.setRoot(HomePage),
				error => alert(error)
			);
	}
}
