import CardStore from './CardStore.js';
import DraftOptionsStore from './DraftOptionsStore.js';
import constants from './FluxConstants.js';
import Fluxxor from 'fluxxor';

const actions = {
  selectCard: function(cardId, playerNum) {
    this.dispatch(constants.SELECT_CARD, {cardId, playerNum});
  },

  toggleNameEdit: function(playerNum) {
    this.dispatch(constants.TOGGLE_NAME_EDIT, {playerNum});
  },

  editName: function(newName, playerNum) {
    this.dispatch(constants.EDIT_NAME, {newName, playerNum});
  },

  selectNumPlayers: function(numPlayers) {
    this.dispatch(constants.SELECT_NUM_PLAYERS, {numPlayers});
  },

  selectNumBans: function(numBans) {
    this.dispatch(constants.SELECT_NUM_BANS, {numBans});
  },

  toggleSnakeDraft: function(shouldTurnOn) {
    this.dispatch(constants.TOGGLE_SNAKE_DRAFT, {shouldTurnOn});
  },

  confirmDraftOptions: function() {
    this.dispatch(constants.CONFIRM_DRAFT_OPTIONS);
  },

  banCard: function(cardId) {
    this.dispatch(constants.BAN_CARD, {cardId})
  }
};

const stores = {
  CardStore: new CardStore(),
  DraftOptionsStore: new DraftOptionsStore()
};

const flux = new Fluxxor.Flux(stores, actions);

flux.on("dispatch", function(type, payload) {
  if (console && console.log) {
    console.log("[Dispatch]", type, payload);
  }
});

export default flux;