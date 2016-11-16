import React, { Component } from 'react';
import Fluxxor from 'fluxxor';
import './Draft.css';

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;


const Draft = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin("CardStore")],

  getStateFromFlux: function() {
    return this.getFlux().store("CardStore").getState();
  },

  render: function() {
    return (
      <div>
        {this.getTopLabel()}
        {this.getCardPool()}
        {this.getCardSelections()}
      </div>
    );
  },



  getTopLabel: function() {
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
    for (const cardId in cardImageMap) {
      if (selectedCards.has(cardId)) {
        continue;
      }
      const imageSrc = "./cards/" + cardImageMap[cardId];
      let onClickFunction = () => this.selectCard(cardId);
      if (cardStore.isDraftFinished()) {
        onClickFunction = null;
      }
      images.push(
        <img key={cardId} src={imageSrc} className="card" onClick={onClickFunction}/>
      );
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
    const playerBoxes = [];

    for (const playerNum in playerNames) {
      const playerName = playerNames[playerNum];
      let images = [];
      const playerCards = this.getFlux().store("CardStore").getPlayerCards()[playerNum];
      for (let i = 0; i < 10; i++) {

        let imageSrc = "./cards/mystery.png";

        if (playerCards.length > i) {
          imageSrc = "./cards/" + cardImageMap[playerCards[i]];
        }
        images.push(
          <img key={playerNum + " " + i} src={imageSrc} className="card"/>
        );
      }
      let nameSection = (
        <h3 className="player-name" onClick={() => this.toggleNameEdit(playerNum)}>
            {playerName}
        </h3>
      );
      if (this.getFlux().store("CardStore").isEditingName(playerNum)) {
        nameSection = <input className="player-edit-name-input" onKeyUp={(e) => this.editName(e, playerNum)} 
        onBlur={() => this.toggleNameEdit(playerNum)}/>;
      }
      playerBoxes.push(
        <td className="player-box" key={playerNum}>
          {nameSection}
          <div className="player-card-pool">
            {images}
          </div>
        </td>
      );
    }

    return (
      <table>
        <tbody>
          <tr>
            {playerBoxes}
          </tr>
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

  selectCard: function(cardId) {
    this.getFlux().actions.selectCard(cardId, this.getFlux().store("CardStore").getCurrentPlayer());
  }
});

export default Draft;
