import Fluxxor from 'fluxxor';
import constants from './FluxConstants.js';

const cardImageMap = {
	'archers': 'archers.png',
	'arrows': 'arrows.png',
	'baby_dragon': 'baby_dragon.png',
	'balloon': 'balloon.png',
	'barbarian_hut': 'barbarian_hut.png',
	'barbarians': 'barbarians.png',
	'bomb_tower': 'bomb_tower.png',
	'bomber': 'bomber.png',
	'bowler': 'bowler.png',
	'cannon': 'cannon.png',
	'dark_prince': 'dark_prince.png',
	'elixir_collector': 'elixir_collector.png',
  'elite_barbarians': 'elite_barbarians.png',
	'fire_spirits': 'fire_spirits.png',
	'fireball': 'fireball.png',
	'freeze': 'freeze.png',
	'furnace': 'furnace.png',
	'giant': 'giant.png',
	'giant_skeleton': 'giant_skeleton.png',
	'goblin_barrel': 'goblin_barrel.png',
	'goblin_hut': 'goblin_hut.png',
	'goblins': 'goblins.png',
	'golem': 'golem.png',
	'graveyard': 'graveyard.png',
	'guards': 'guards.png',
	'hog_rider': 'hog_rider.png',
	'ice_golem': 'ice_golem.png',
	'ice_spirit': 'ice_spirit.png',
	'ice_wizard': 'ice_wizard.png',
	'inferno_dragon': 'inferno_dragon.png',
	'inferno_tower': 'inferno_tower.png',
	'knight': 'knight.png',
	'lava_hound': 'lava_hound.png',
	'lightning': 'lightning.png',
	'lumberjack': 'lumberjack.png',
	'mega_minion': 'mega_minion.png',
	'miner': 'miner.png',
	'mini_pekka': 'mini_pekka.png',
	'minion_horde': 'minion_horde.png',
	'minions': 'minions.png',
	'mirror': 'mirror.png',
	'mortar': 'mortar.png',
	'musketeer': 'musketeer.png',
	'pekka': 'pekka.png',
	'poison': 'poison.png',
	'prince': 'prince.png',
	'princess': 'princess.png',
	'rage': 'rage.png',
	'rocket': 'rocket.png',
	'royal_giant': 'royal_giant.png',
	'skeleton_army': 'skeleton_army.png',
	'skeletons': 'skeletons.png',
	'sparky': 'sparky.png',
	'spear_goblins': 'spear_goblins.png',
	'tesla': 'tesla.png',
	'the_log': 'the_log.png',
	'three_musketeers': 'three_musketeers.png',
	'tombstone': 'tombstone.png',
	'tornado': 'tornado.png',
	'valkyrie': 'valkyrie.png',
	'witch': 'witch.png',
	'wizard': 'wizard.png',
	'x-bow': 'x-bow.png',
	'zap': 'zap.png'
}

const CardStore = Fluxxor.createStore({
  initialize: function() {
    this.playerCards = {};
    this.bannedCards = new Set();
    this.playerNames = {};
    this.isEditingNameArray = [];
    this.currentPlayer = 1;
    this.selectedCards = new Set();
    this.isSnakingBack = false;
    this.numBansLeft = 0;

    this.bindActions(
      constants.SELECT_CARD, this.onSelectCard,
      constants.TOGGLE_NAME_EDIT, this.onToggleNameEdit,
      constants.EDIT_NAME, this.onEditName,
      constants.CONFIRM_DRAFT_OPTIONS, this.onConfirmDraftOptions,
      constants.BAN_CARD, this.onBanCard
    );
  },

  onSelectCard: function({cardId, playerNum}) {
  	this.playerCards[playerNum].push(cardId);
  	this.selectedCards.add(cardId);
    const numPlayers = this.flux.store("DraftOptionsStore").getNumPlayers();
    const isSnakeDraft = this.flux.store("DraftOptionsStore").getIsSnakeDraft();
    if (this.isSnakingBack) {
      this.currentPlayer--;
    } else {
      this.currentPlayer++;
    }
    if (this.currentPlayer == 0) {
      this.isSnakingBack = false;
      this.currentPlayer = 1;
    }
    if (this.currentPlayer == numPlayers + 1) {
      if (isSnakeDraft) {
        this.isSnakingBack = true;
        this.currentPlayer = numPlayers;
      } else {
        this.currentPlayer = 1;
      }
    }
    this.emit("change");
  },

  onBanCard: function({cardId}) {
    this.bannedCards.add(cardId);
    this.numBansLeft--;
    this.emit("change");
  },

  onToggleNameEdit: function({playerNum}) {
  	this.isEditingNameArray[playerNum-1] = !this.isEditingNameArray[playerNum-1];
  	this.emit("change");
  },

  onEditName: function({newName, playerNum}) {
  	this.playerNames[playerNum] = newName;
  	this.emit("change");
  },

  onConfirmDraftOptions: function() {
    this.numBansLeft = this.flux.store("DraftOptionsStore").getNumBans();
    const numPlayers = this.flux.store("DraftOptionsStore").getNumPlayers();
    for (let i = 0; i < numPlayers; i++) {
      this.playerCards[i+1] = [];
      this.playerNames[i+1] = "Player " + (i+1);
      this.isEditingNameArray.push(false);
    }

    this.emit("change");
  },

  getState: function() {
    return {
      playerCards: this.playerCards,
      currentPlayer: this.currentPlayer
    };
  },

  getIsDoingBans: function() {
    return this.numBansLeft > 0;
  },

  getNumBansLeft: function() {
    return this.numBansLeft;
  },

  getCardImageMap: function() {
  	return cardImageMap;
  },

  getCurrentPlayer: function() {
  	return this.currentPlayer;
  },

  getPlayerNames: function() {
  	return this.playerNames;
  },

  getPlayerCards: function() {
  	return this.playerCards;
  },

  getSelectedCards: function() {
  	return this.selectedCards;
  },

  isEditingName: function(playerNum) {
  	return this.isEditingNameArray[playerNum-1];
  },

  isDraftFinished: function() {
    const numPlayers = this.flux.store("DraftOptionsStore").getNumPlayers();
  	return this.selectedCards.size >= 40 && this.selectedCards.size >= numPlayers * 8;
  },

  isCardBanned: function(cardId) {
    return this.bannedCards.has(cardId);
  }
});

export default CardStore;