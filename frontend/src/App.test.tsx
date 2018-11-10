import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Movies from './Movies';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Movies />, div);
  ReactDOM.unmountComponentAtNode(div);
});
