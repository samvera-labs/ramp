import React from 'react';
import videojs from 'video.js';

function Yo({ vjsComponent, handleClick }) {
  return (
    <button onClick={() => handleClick('Ima message')}>yo click me</button>
  );
}

const vjsComponent = videojs.getComponent('Component');

class vjsYo extends vjsComponent {
  constructor(player, options) {
    super(player, options);
    this.setAttribute('data-testid', 'vjs-yo');
    this.addClass('vjs-yo');
    this.controlText('Yo');
    // Stock icon from videojs/icons
    this.setIcon('vjs-yo');

    this.player = player;
    // Options passed from MediaPlayer
    this.options = player;

    this.player.on('loadstart', () => {
      // Update component on player reload
    });
  }

  handleClick(msg) {
    console.log('handling click', msg);
  }
}

vjsComponent.registerComponent('vjsYo', vjsYo);

export default vjsYo;
