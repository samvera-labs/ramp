import React from 'react';
import { createRoot } from 'react-dom/client';
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

    this.root = createRoot(this.el());

    this.mount = this.mount.bind(this);

    /* When player is ready, call method to mount React component */
    player.ready(() => {
      this.mount();
    });

    /* Remove React root when component is destroyed */
    this.on('dispose', () => {
      this.root.unmount();
    });
  }

  handleClick(msg) {
    console.log('handling click', msg);
  }

  mount() {
    this.root.render(
      <Yo vjsComponent={this} handleClick={this.handleClick} />
    );
  }
}

vjsComponent.registerComponent('vjsYo', vjsYo);

export default vjsYo;
