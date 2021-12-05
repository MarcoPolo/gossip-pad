//@ts-ignore
import stuff from 'node-libs-browser'
import * as React from 'react';
import reactDOM from 'react-dom';
import Editor from './Editor'

document.addEventListener('DOMContentLoaded', () => {
  reactDOM.render(<Editor />, document.getElementById('root'),);
})