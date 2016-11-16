import CardStore from './CardStore.js';
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
};

const stores = {
  CardStore: new CardStore()
};

const flux = new Fluxxor.Flux(stores, actions);

flux.on("dispatch", function(type, payload) {
  if (console && console.log) {
    console.log("[Dispatch]", type, payload);
  }
});

export default flux;