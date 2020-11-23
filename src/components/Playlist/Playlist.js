import React, { useState } from 'react';
import {
  useManifestState,
  useManifestDispatch,
} from '../../context/manifest-context';
import {
  usePlayerDispatch,
  usePlayerState,
} from '../../context/player-context';

const getItemLabel = ({ label }) => {
  return label[0];
};

const Playlist = ({ manifest = [] }) => {
  const [activeItem, setActiveItem] = useState();
  const dispatch = useManifestDispatch();
  const manifestState = useManifestState();
  console.log(manifestState);

  // const playerState = usePlayerState();
  // const playerDispatch = usePlayerDispatch();

  const getPlaylistItems = ({ manifests }) => {
    const manifestData = manifests.reduce(
      (result, item) => [
        ...result,
        { id: item['@id'], label: getItemLabel(item) },
      ],
      []
    );

    return manifestData;
  };

  const fetchPlaylistManifest = ({ id: manifestUrl }) => {
    fetch(manifestUrl)
      .then((result) => result.json())
      .then((data) => {
        dispatch({ manifest: data, type: 'updateManifest' });
        setActiveItem(manifestUrl);
        console.log(data);

        return data;
      });
  };

  return (
    <div>
      {getItemLabel(manifest)}
      <ul className="irmp--playlist__list">
        {getPlaylistItems(manifest).map((item) => {
          return (
            <li
              key={item.id}
              className={`irmp--playlist__list-item ${
                item.id === activeItem ? 'active' : ''
              }`}
              onClick={() => fetchPlaylistManifest(item)}
            >
              {item.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Playlist;
