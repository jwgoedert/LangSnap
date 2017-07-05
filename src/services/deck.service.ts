import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Config } from '../config';

@Injectable()
export class DeckService {
  public usersDecks: Array<any> = [];
  public allDecks: Array<any> = [];
  public allCards: Array<any> = [];
  public deckId: any;
  public deckName: any;
  public currentDeck: Array<any> = [];
  public cardNames: Array<any> = [];
  public creatingDeck: Array<object> = [];
  public deckEditCards: any;
  public editDeckId: any;

  constructor(
    public http: Http,
    private config: Config) {
    this.http = http;
  }
  // adds a card to current deck creation for page display
  addToDeckCreation(card) {
    this.creatingDeck.push(card);
    console.log('JSON.stringify(this.creatingDeck[this.creatingDeck.length - 1])')
    console.log(JSON.stringify(this.creatingDeck[this.creatingDeck.length - 1]))
    console.log('JSON.stringify(this.creatingDeck[this.creatingDeck.length - 1])')
  }

  // edit card in current deck creation in case user changes their word 
  editDeckCreation(word) {
    this.creatingDeck[this.creatingDeck.length - 1]['word'] = word;
  }

  // returns the creation deckk for page display
  deckCreation() {
    return this.creatingDeck;
  }

  clearDeckCreation() {
    this.creatingDeck = [];
  }

  getDeckId() {
    return this.deckId;
  }

  setDeckId(id) {
    this.deckId = id;
  }
  setEditDeckId(id) {
    this.editDeckId = id;
  }

  getCurrentDeck() {
    return this.currentDeck;
  }

  // posts a deck to a user 
  postUserDeck(deckName, userId) {
    console.log('hitting post cards to user deck function')
    let reqBody = {
      "name": deckName,
      "user_id": userId,
      "stars": 5
    }
    return this.http.post(`${this.config.serverUrl}/decks/new`, reqBody)
      .map(deck => deck.json())
      .subscribe(deckObj => {
        this.deckId = deckObj.id;
        return deckObj.id;
      }), error => console.log(error);
  }

  //post cards to a users deck
  postCardToUserDeck(addCard) {
    this.http.post(`${this.config.serverUrl}/cards/addcard`, addCard)
      .map(deck => deck.json())
      .subscribe(deckObj => {
        return deckObj.id;
      }), error => console.log(error);

  }

  postCardsToUserDeck(addCards) {
    console.log('adding cards to a user deck')
    this.http.post(`${this.config.serverUrl}/decks/addcards`, addCards)
      .map(deck => deck)
      .subscribe(deckres => deckres),
      error => {
        console.log('Error adding cards');
        console.log(error);
      }
  }

  addDecksToUser(addDecks) {
    this.http.post(`${this.config.serverUrl}/decks/adddecks`, addDecks)
      .map(deck => deck)
      .subscribe(deckres => deckres),
      error => {
        console.log('Error adding cards');
        console.log(error);
      }
  }

  // gets  all user decks 
  getUsersDecks(userId) {
    this.usersDecks = [];
    return this.http.get(`${this.config.serverUrl}/decks/userid/${userId}`)
      .map(deck => deck.json().forEach(el => {
        this.usersDecks.push(el);
        return this.usersDecks;
      }))
      .subscribe(deckName => {
        return this.usersDecks.reverse();
      }), error => console.log(error);
  }

  // gets  all cards for a specific deck 
  getAllCardsInADeck(userDeckId) {
    this.currentDeck = []
    return this.http.get(`${this.config.serverUrl}/cards/deckid/${userDeckId}`)
      .map(deck => deck.json().forEach(el => {
        this.currentDeck.push(el);
        return el;
      }))
      .subscribe(deck => {
        if (!this.currentDeck[0].cards.length) {
          this.currentDeck[0].cards[0] = {
            imgUrl: "https://www.askideas.com/media/08/Sorry-With-Emoticon-Picture.jpg",
            wordMap: JSON.stringify({
              sorry: "No Cards, Try Adding Some.",
              reallSorry: "Add Cards To This Deck With Edit."
            })
          }
          return this.currentDeck;
        } else {
          this.deckEditCards = this.currentDeck;
          return this.currentDeck;
        }
      }), error => console.log(error);
  }


  // get all decks for all users 
  getAllDecks() {
    this.allDecks = [];
    this.http.get(`${this.config.serverUrl}/decks/all`)
      .map(deck => deck.json().forEach(el => {
        this.allDecks.push(el);
        return this.allDecks;
      }))
      .subscribe(deckName => {
        return this.allDecks;
      }), error => console.log(error);
  }

  //gets all cards from all users so user can add cards to their own deck
  getAllCards() {
    this.http.get(`${this.config.serverUrl}/cards/all`)
      .map(cards => {
        return cards.json()
      })
      .subscribe(allCards => {
        allCards.forEach((card, index) => {
          if (JSON.parse(card.wordMap)['en'] && (this.cardNames.indexOf(JSON.parse(card.wordMap)['en']) === -1)) {
            this.cardNames.push(JSON.parse(card.wordMap)['en']);
            this.allCards.push(card);
          }
        })
        return allCards;
      })
  }

  deleteADeck(deckId, userId) {
    this.http.delete((`${this.config.serverUrl}/decks/${deckId}`))
      .map(res => res)
      .subscribe(resp => {
        return resp;
      }), err => {
        console.log(JSON.stringify(err));
      }
  }

  deleteCardFromUserDeck(userId, deckId, itemId) {
    this.http.delete((`${this.config.serverUrl}/decks/userid/${userId}/deckid/${deckId}/cardid/${itemId}`))
      .map(res => res)
      .subscribe(resp => {
        return resp;
      }), err => {
        console.log(JSON.stringify(err));
      }
  }
}