import React, { Component } from 'react';
import Fluxxor from 'fluxxor';
import './Draft.css';

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;


const Draft = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin("CardStore", "DraftOptionsStore")],

  getStateFromFlux: function() {
    return this.getFlux().store("CardStore").getState();
  },

  render: function() {
    if (this.getFlux().store("DraftOptionsStore").getHasConfirmedDraftOptions()) {
      return (
        <div>
          {this.getTopLabel()}
          {this.getCardPool()}
          {this.getCardSelections()}
        </div>
      );
    } else {
      return this.getDraftOptionsPage();
    }
  },

  getDraftOptionsPage: function() {
    return (
      <div>
        {this.getNumPlayersOptions()}
        {this.getNumBansOptions()}
        {this.getSnakeDraftOptions()}
        {this.getConfirmButton()}
      </div>
    );
  },

  getNumPlayersOptions: function() {
    const numPlayers = this.getFlux().store("DraftOptionsStore").getNumPlayers();
    return (
      <div>
        <h2 className="draft-options-label">
          Number Of Players
        </h2>
        <div>
          <h3 className={"draft-options-number " + (numPlayers == 4 ? "selected-num-players" : "")} onClick={() => this.selectNumPlayers(4)}>
            4
          </h3>
          <h3 className={"draft-options-number " + (numPlayers == 8 ? "selected-num-players" : "")} onClick={() => this.selectNumPlayers(8)}>
            8
          </h3>
        </div>
      </div>
    );
  },

  selectNumPlayers: function(numPlayers) {
    this.getFlux().actions.selectNumPlayers(numPlayers);
  },

  getNumBansOptions: function() {
    const numBans = this.getFlux().store("DraftOptionsStore").getNumBans();
    const numCards = Object.keys(this.getFlux().store("CardStore").getCardImageMap()).length;
    const numPlayers = this.getFlux().store("DraftOptionsStore").getNumPlayers();
    const numPossibleBans = numCards - numPlayers * 8;
    let banOptions = [
      <h3 className={"draft-options-number " + (numBans == 0 ? "selected-num-bans" : "")} onClick={() => this.selectNumBans(0)}>
        0
      </h3>
    ];
    for (let i = 1; i <= numPossibleBans && i <= 2; i++) {
      banOptions.push(
        <h3 id={"bans-" + i} className={"draft-options-number " + (numBans == i ? "selected-num-bans" : "")} onClick={() => this.selectNumBans(i)}>
          {i}
        </h3>
      );
    }
    return (
      <div>
        <h2 className="draft-options-label">
          Number Of Bans
        </h2>
        <div>
          {banOptions}
        </div>
      </div>
    );
  },

  selectNumBans: function(numBans) {
    this.getFlux().actions.selectNumBans(numBans);
  },

  getSnakeDraftOptions: function() {
    const isSnakeDraft = this.getFlux().store("DraftOptionsStore").getIsSnakeDraft();
    return (
      <div>
        <h2 className="draft-options-label">
          Draft Mode
        </h2>
        <div>
          <h3 className={"draft-options-text " + (!isSnakeDraft ? "selected-snake-draft" : "")} onClick={() => this.toggleSnakeDraft(false)}>Regular</h3>
          <h3 className={"draft-options-text " + (isSnakeDraft ? "selected-snake-draft" : "")} onClick={() => this.toggleSnakeDraft(true)}>Snake</h3>
        </div>
      </div>
    );
  },

  toggleSnakeDraft: function(shouldTurnOn) {
    this.getFlux().actions.toggleSnakeDraft(shouldTurnOn);
  },

  getConfirmButton: function() {
    return (
      <button onClick={this.confirmDraftOptions}>Confirm</button>
    );
  },

  confirmDraftOptions: function() {
    this.getFlux().actions.confirmDraftOptions();
  },

  getTopLabel: function() {
    if (this.getFlux().store("DraftOptionsStore").getNumPlayers() == 8) {
      return;
    }
    if (this.getFlux().store("CardStore").getIsDoingBans()) {
      return (
        <h2 className="player-name">
          Ban a card
        </h2>
      );
    }
    if (this.getFlux().store("CardStore").isDraftFinished()) {
      return (
        <h2 className="player-name">
          Done!
        </h2>
      );
    }
    return (
      <h2 className="player-name">
        {this.getCurrentPlayerName() + "'s turn"}
      </h2>
    );
  },

  getCurrentPlayerName: function() {
    const currentPlayer = this.getFlux().store("CardStore").getCurrentPlayer();
    return this.getFlux().store("CardStore").getPlayerNames()[currentPlayer];
  },

  getCardPool: function() {
    let images = [];
    const cardStore = this.getFlux().store("CardStore");
    const cardImageMap = cardStore.getCardImageMap();
    const selectedCards = cardStore.getSelectedCards();
    const numPlayers = this.getFlux().store("DraftOptionsStore").getNumPlayers();
    for (const cardId in cardImageMap) {
      if (selectedCards.has(cardId)) {
        continue;
      }
      const imageSrc = "./cards/" + cardImageMap[cardId];
      let onClickFunction = () => this.selectCard(cardId);
      if (cardStore.getIsDoingBans()) {
        onClickFunction = () => this.banCard(cardId);
      }
      const isCardBanned = this.getFlux().store("CardStore").isCardBanned(cardId);
      if (cardStore.isDraftFinished() || isCardBanned) {
        onClickFunction = null;
      }
      const cardClassName = numPlayers == 8 ? "card eight-players" : "card";
      if (isCardBanned) {
        images.push(
          <div className="banned-card-slot">
            <img key={cardId} src={imageSrc} className={cardClassName + " banned-card"} onClick={onClickFunction}/>
          </div>
        );
      } else {
        images.push(
          <img key={cardId} src={imageSrc} className={cardClassName} onClick={onClickFunction}/>
        );
      }
    }
    return (
      <div className="draft-pool">
        {images}
      </div>
    );
  },

  getCardSelections: function() {
    const playerNames = this.getFlux().store("CardStore").getPlayerNames();
    const cardImageMap = this.getFlux().store("CardStore").getCardImageMap();
    const currentPlayer = this.getFlux().store("CardStore").getCurrentPlayer();
    const numPlayers = Object.keys(playerNames).length;
    const playerBoxesFirstRow = [];
    const playerBoxesSecondRow = [];

    for (const playerNum in playerNames) {
      const playerName = playerNames[playerNum];
      let images = [];
      const playerCards = this.getFlux().store("CardStore").getPlayerCards()[playerNum];
      const numCardSelections = numPlayers == 4 ? 10 : 8;
      for (let i = 0; i < numCardSelections; i++) {

        let imageSrc = "./cards/mystery.png";

        if (playerCards.length > i) {
          imageSrc = "./cards/" + cardImageMap[playerCards[i]];
        }
        images.push(
          <img key={playerNum + " " + i} src={imageSrc} className="card"/>
        );
      }
      const playerNameClass = numPlayers == 8 ? "player-name eight-players" : "player-name";
      let nameSection = (
        <h3 className={playerNameClass} onClick={() => this.toggleNameEdit(playerNum)}>
            {playerName}
        </h3>
      );
      if (this.getFlux().store("CardStore").isEditingName(playerNum)) {
        nameSection = <input className="player-edit-name-input" onKeyUp={(e) => this.editName(e, playerNum)} 
        onBlur={() => this.toggleNameEdit(playerNum)}/>;
      }
      let playerCardPoolClassName = "player-card-pool";
      if (numCardSelections == 8) {
        playerCardPoolClassName += " eight-players";
      }
      const shouldHighlightBox = currentPlayer == playerNum && !this.getFlux().store("CardStore").isDraftFinished()
        && !this.getFlux().store("CardStore").getIsDoingBans();
      if (playerNum > 4) {
        playerBoxesSecondRow.push(
          <td className={"player-box " + (shouldHighlightBox ? "player-box-current-turn" : "")} key={playerNum}>
            {nameSection}
            <div className={playerCardPoolClassName}>
              {images}
            </div>
          </td>
        );
      } else {
        playerBoxesFirstRow.push(
          <td className={"player-box " + (shouldHighlightBox ? "player-box-current-turn" : "")} key={playerNum}>
            {nameSection}
            <div className={playerCardPoolClassName}>
              {images}
            </div>
          </td>
        );
      }
    }

    let tRows = [
      <tr id="first-row">
        {playerBoxesFirstRow}
      </tr>
    ];
    if (playerBoxesSecondRow.length > 0) {
      tRows.push(
        <tr id="second-row">
          {playerBoxesSecondRow}
        </tr>
      );
    }

    const tableClassName = numPlayers == 8 ? "eight-players" : "";
    return (
      <table className={tableClassName}>
        <tbody>
          {tRows}
        </tbody>
      </table>
    );
  },

  editName: function(e, playerNum) {
    const code = e.which;
    if (code === 13) {
      // Enter key was pressed
      e.preventDefault();
      this.getFlux().actions.toggleNameEdit(playerNum);
    } else {
      this.getFlux().actions.editName(e.target.value, playerNum);
    }
  },

  toggleNameEdit: function(playerNum) {
    this.getFlux().actions.toggleNameEdit(playerNum);
  },

  banCard: function(cardId) {
    this.getFlux().actions.banCard(cardId);
  },

  selectCard: function(cardId) {
    this.getFlux().actions.selectCard(cardId, this.getFlux().store("CardStore").getCurrentPlayer());
  }
});

export default Draft;
