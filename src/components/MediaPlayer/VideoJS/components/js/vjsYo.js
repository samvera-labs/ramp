import React from 'react';
import ReactDOM from 'react-dom';
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
    this.mount = this.mount.bind(this);

    /* When player is ready, call method to mount React component */
    player.ready(() => {
      this.mount();
    });

    /* Remove React root when component is destroyed */
    this.on('dispose', () => {
      ReactDOM.unmountComponentAtNode(this.el());
    });
  }

  handleClick(msg) {
    console.log('handling click', msg);
  }

  mount() {
    ReactDOM.render(
      <Yo vjsComponent={this} handleClick={this.handleClick} />,
      this.el()
    );
  }
}

vjsComponent.registerComponent('vjsYo', vjsYo);

export default vjsYo;
