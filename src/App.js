import React from 'react';
import { render } from 'react-dom';
import Pomodoro from './Pomodoro.jsx';

const App = () => {
  return <Pomodoro />;
};
render(React.createElement(App), document.getElementById('root'));
