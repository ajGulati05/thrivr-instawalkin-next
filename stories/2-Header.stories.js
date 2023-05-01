import React from 'react';
import { action } from '@storybook/addon-actions';
import Header from '../components/Header/index';

export default {
  title: 'Header',
  component: Header,
};

export const DarkBg = () => (
  <div className="bg-secondary" style={{ height: 110 }}>
    <Header onClick={action('clicked')} />
  </div>
);
