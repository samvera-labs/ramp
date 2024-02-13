import * as util from './utility-helpers';
import { useLocalStorage } from '@Services/local-storage';
import * as React from 'react';
import { render } from '@testing-library/react';

describe.skip('local storage', () => {
  describe('useLocalStorage', () => {
    test('default value', () => {
      let settingRef = React.createRef();

      function TestComponent() {
        const [setting, setSetting] = useLocalStorage('setting', {});

        React.useEffect(() => {
          settingRef.currrent = setting;
        });

        return null;
      }
      render(<TestComponent/>);

      expect(settingRef.current).toEqual({});
      setSetting({'key': 'value'})
      expect(setting).toEqual({'key': 'value'});
    });
  });
});
