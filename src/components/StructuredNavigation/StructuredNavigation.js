import React, { useEffect } from 'react';
import List from '@Components/List';
import { getMediaFragment, getCanvasId } from '@Services/iiif-parser';
import PropTypes from 'prop-types';

const StructuredNavigation = ({ manifest }) => {
  if (manifest.structures) {
    console.log('manifest.structures', manifest.structures);
    return (
      <div
        data-testid="structured-nav"
        className="structured-nav"
        key={Math.random()}
      >
        {manifest.structures[0] && manifest.structures[0].items
          ? manifest.structures[0].items.map((item, index) => (
              <List items={[item]} key={index} isChild={false} />
            ))
          : null}
      </div>
    );
  }
  return <p>There are no structures in the manifest.</p>;
};

StructuredNavigation.propTypes = {
  manifest: PropTypes.object.isRequired,
};

export default StructuredNavigation;
