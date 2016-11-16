import Fluxxor from 'fluxxor';
import constants from './FluxConstants.js';

const cardImageMap = {
	'archers': 'archers.png',
	'baby_dragon': 'baby_dragon.png',
	'barbarians': 'barbarians.png',
	'bomber': 'bomber.png',
	'bowler': 'bowler.png',
	'balloon': 'balloon.png',
	'dark_prince': 'dark_prince.png',
	'fire_spirits': 'fire_spirits.png',
	'giant': 'giant.png',
	'giant_skeleton': 'giant_skeleton.png',
	'goblins': 'goblins.png',
	'golem': 'golem.png',
	'graveyard': 'graveyard.png',
	'guards': 'guards.png',
	'hog_rider': 'hog_rider.png',
	'ice_spirit': 'ice_spirit.png',
	'ice_wizard': 'ice_wizard.png',
	'ice_golem': 'ice_golem.png',
	'inferno_dragon': 'inferno_dragon.png',
	'knight': 'knight.png',
	'lava_hound': 'lava_hound.png',
	'lumberjack': 'lumberjack.png',
	'mega_minion': 'mega_minion.png',
	'miner': 'miner.png',
	'mini_pekka': 'mini_pekka.png',
	'minions': 'minions.png',
	'minion_horde': 'minion_horde.png',
	'musketeer': 'musketeer.png',
	'pekka': 'pekka.png',
	'prince': 'prince.png',
	'princess': 'princess.png',
	'royal_giant': 'royal_giant.png',
	'skeleton_army': 'skeleton_army.png',
	'skeletons': 'skeletons.png',
	'sparky': 'sparky.png',
	'spear_goblins': 'spear_goblins.png',
	'the_log': 'the_log.png',
	'three_musketeers': 'three_musketeers.png',
	'valkyrie': 'valkyrie.png',
	'witch': 'witch.png',
	'wizard': 'wizard.png',
	'arrows': 'arrows.png',
	'freeze': 'freeze.png',
	'fireball': 'fireball.png',
	'goblin_barrel': 'goblin_barrel.png',
	'lightning': 'lightning.png',
	'mirror': 'mirror.png',
	'poison': 'poison.png',
	'rage': 'rage.png',
	'rocket': 'rocket.png',
	'tornado': 'tornado.png',
	'zap': 'zap.png',
	'barbarian_hut': 'barbarian_hut.png',
	'bomb_tower': 'bomb_tower.png',
	'cannon': 'cannon.png',
	'elixir_collector': 'elixir_collector.png',
	'furnace': 'furnace.png',
	'goblin_hut': 'goblin_hut.png',
	'inferno_tower': 'inferno_tower.png',
	'mortar': 'mortar.png',
	'tombstone': 'tombstone.png',
	'tesla': 'tesla.png',
	'x-bow': 'x-bow.png'
}

const CardStore = Fluxxor.createStore({
  initialize: function() {
    this.playerCards = {
    	1: [],
    	2: [],
    	3: [],
    	4: []
    };
    this.playerNames = {
    	1: "Player One",
    	2: "Player Two",
    	3: "Player Three",
    	4: "Player Four"
    };
    this.isEditingNameArray = [false, false, false, false];
    this.currentPlayer = 1;
    this.selectedCards = new Set();


    this.bindActions(
      constants.SELECT_CARD, this.onSelectCard,
      constants.TOGGLE_NAME_EDIT, this.onToggleNameEdit,
      constants.EDIT_NAME, this.onEditName
    );
  },

  onSelectCard: function({cardId, playerNum}) {
  	this.playerCards[playerNum].push(cardId);
  	this.selectedCards.add(cardId);
  	this.currentPlayer++;
  	if (this.currentPlayer == 5) {
  		this.currentPlayer = 1;
  	}
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

  getState: function() {
    return {
      playerCards: this.playerCards,
      currentPlayer: this.currentPlayer
    };
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
  	return this.selectedCards.size == 40;
  }
});

export default CardStore;