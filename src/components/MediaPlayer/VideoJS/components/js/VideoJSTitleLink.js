import React from 'react';
import ReactDOM from 'react-dom';
import videojs from 'video.js';
import '../styles/VideoJSTitleLink.scss';

const vjsComponent = videojs.getComponent('Component');

class VideoJSTitleLink extends vjsComponent {
  constructor(player, options) {
    super(player, options);
    this.setAttribute('data-testid', 'videojs-title-link');

    this.mount = this.mount.bind(this);
    this.options = options;
    this.player = player;

    /* When player src is changed, call method to mount and update title link */
    player.on('loadstart', () => {
      this.options = {...this.options, title: player.canvasLink['label'], link: player.canvasLink['id']};
      this.mount();
    });

    /* Remove React root when component is destroyed */
    this.on('dispose', () => {
      ReactDOM.unmountComponentAtNode(this.el());
    });
  }

  mount() {
    ReactDOM.render(
      <TitleLink
        {...this.options}
        player={this.player} />,
      this.el()
    );
  }
}

function TitleLink ({
  title,
  link,
  player
}) {
  let href = null;
  /**
   * Avalon canvas ids are of the form 'http://host.edu/media_objects/#mo_id/manifest/canvas/#section_id`.
   * Accessible url is 'http://host.edu/media_objects/#mo_id/section/#section_id' so we convert the canvas
   * id for avalon manifest, but must assume other implementers will have the id as an actionable link.
   */
  if (link.includes('manifest/canvas')) {
    href = link.replace('manifest/canvas', 'section');
  } else {
    href = link;
  }

  return (
    <div className='vjs-title-bar'>
      <a className='vjs-title-link' href={href} target='_blank' rel='noreferrer noopener'>{title}</a>
    </div>
  )
}

vjsComponent.registerComponent('VideoJSTitleLink', VideoJSTitleLink);

export default VideoJSTitleLink;