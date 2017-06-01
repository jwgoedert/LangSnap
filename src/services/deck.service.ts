import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { OAuthProfile } from '../pages/oauth/models/oauth-profile.model';
import { Config } from '../config';
@Injectable()
export class DeckService {
  private serverDBUrl = `http://52.14.252.211`;
  // private serverDBUrl = `http://b79754e7.ngrok.io`;
  public usersDecks: any;
  public allDecks: any;
  public deckId: any;

  constructor(
    public http: Http,
    public alertCtrl: AlertController,
    public config: Config) {
    this.http = http;
    this.alertCtrl = alertCtrl;
    this.usersDecks = [];
    this.allDecks = [];
  }
  ngOnInit() {
    this.usersDecks = this.getUsersDecks(1);
    this.allDecks = this.getAllDecks();
  }
  //create deck page
  postUserDeck(deckName, userId) {
    let reqBody = {
      "name": deckName,
      "user_id": userId,
      "stars": 5
    }
    console.log('inside post user deck');
    return this.http.post(`${this.serverDBUrl}/v1/decks/new`, reqBody)
      .map(deck => deck.json())
      .subscribe(deckObj => {
        this.deckId = deckObj.id; 
        return deckObj.id;
      }), error => console.log(error);
  }
  //post cards to deck
  getDeckId() {
    return this.deckId;
  }
  postCardToUserDeck(addCard) {
    console.log('inside post card')
    console.log(JSON.stringify(addCard))
    console.log('inside post card')
    this.http.post(`${this.serverDBUrl}/v1/cards/addcard`, addCard)
      .map(deck => deck.json())
      .subscribe(deckObj => {
        console.log('post card')
        console.log(JSON.stringify(deckObj));
        console.log('post card')
        return deckObj.id;
      }), error => console.log(error);

  }
  //mydecks page
  getUsersDecks(userId) {
    this.http.get(`${this.serverDBUrl}/v1/decks/userid/${userId}`)
      .map(deck => deck.json().forEach(el => {
        this.usersDecks.push(el.name);
      }))
      .subscribe(deckName => {
        console.log(JSON.stringify(this.usersDecks))
        return deckName;
      }), error => console.log(error);
  }

  getAllCardsInADeck(userDeckId) {
    this.http.get(`${this.serverDBUrl}/v1/cards/deckid/${userDeckId}`)
      .map(deck => deck.json().forEach(el => {
        this.usersDecks.push(el.name);
      }))
      .subscribe(deckName => {
        console.log(JSON.stringify(this.usersDecks))
        return deckName;
      }), error => console.log(error);
  }

  deleteDecks(decks) {

  }
  //find/add decks page
  getAllDecks() {
    this.http.get(`${this.serverDBUrl}/v1/decks/all`)
      .map(deck => deck.json().forEach(el => {
        this.allDecks.push(el);
      }))
      .subscribe(deckName => {
        console.log('ALL decks');
        console.log(JSON.stringify(this.allDecks))
        return deckName;
      }), error => console.log(error);
  }
  addDecksToUser(userId, deckIds) {
  }
  //find a card
  getAllCards() {
    this.http.get(`${this.serverDBUrl}/v1/decks/all`)
  }
  addCards(cards) {
  }

}