import Fluxxor from 'fluxxor';
import constants from './FluxConstants.js';

const DraftOptionsStore = Fluxxor.createStore({
  initialize: function() {
    this.numPlayers = 4;
    this.numBans = 1;
    this.isSnakeDraft = false;
    this.hasConfirmedDraftOptions = false;


    this.bindActions(
      constants.SELECT_NUM_PLAYERS, this.onSelectNumPlayers,
      constants.SELECT_NUM_BANS, this.onSelectNumBans,
      constants.TOGGLE_SNAKE_DRAFT, this.onToggleSnakeMode,
      constants.CONFIRM_DRAFT_OPTIONS, this.onConfirmDraftOptions
    );
  },

  onSelectNumPlayers: function({numPlayers}) {
  	this.numPlayers = numPlayers;
    this.emit("change");
  },

  onSelectNumBans: function({numBans}) {
  	this.numBans = numBans;
  	this.emit("change");
  },

  onToggleSnakeMode: function({shouldTurnOn}) {
  	this.isSnakeDraft = shouldTurnOn;
  	this.emit("change");
  },

  onConfirmDraftOptions: function() {
    this.hasConfirmedDraftOptions = true;
    this.emit("change");
  },

  getState: function() {
    return {
      numPlayers: this.numPlayers,
      numBans: this.numBans,
      isSnakeDraft: this.isSnakeDraft,
      hasConfirmedDraftOptions: this.hasConfirmedDraftOptions
    };
  },

  getNumPlayers: function() {
  	return this.numPlayers;
  },

  getNumBans: function() {
  	return this.numBans;
  },

  getIsSnakeDraft: function() {
  	return this.isSnakeDraft;
  },

  getHasConfirmedDraftOptions: function() {
  	return this.hasConfirmedDraftOptions;
  }
});

export default DraftOptionsStore;