import React from 'react';

const TanscriptSelector = (props) => {
  const selectItem = (t) => {
    props.setTranscript(t);
  };

  if (props.transcripts.length) {
    return (
      <React.Fragment>
        <div className="panel panel-default">
          <span className="selected-transcript">Transcripts: </span>{' '}
          <div className="dropdown">
            <span>
              {props.title}
              <i className="arrow down"></i>
            </span>
            <div className="dropdown-content">
              <ul>
                {props.transcripts.map((t, i) => (
                  <li key={i}>
                    <span key={i} onClick={() => selectItem(t.title)}>
                      {t.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
};

export default TanscriptSelector;
