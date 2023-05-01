import React from 'react';
import { action } from '@storybook/addon-actions';
import Button from '../components/Base/Button/index';

export default {
  title: 'Button',
  component: Button,
};

export const Primary = () => (
  <Button onClick={action('clicked')} className="m-2" varient="primary">
    Primary Button
  </Button>
);

export const Secondary = () => (
  <Button onClick={action('clicked')} className="m-2" varient="secondary">
    Secondary Button
  </Button>
);
