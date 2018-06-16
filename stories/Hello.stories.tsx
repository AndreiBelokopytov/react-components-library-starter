import * as React from 'react';

import { storiesOf } from '@storybook/react';
import Hello from '../lib/Hello/Hello';

import '../lib/Hello/Hello.css';

storiesOf('Hello', module)
  .add('with text', () => <Hello/>)