import React from 'react';
import { action } from '@storybook/addon-actions';
import Datepicker from '../components/Base/Datepicker';

export default {
  title: 'Calender',
  component: Datepicker,
};

export const Primary = () => (
  <div className="w-25 m-2">
    <Datepicker onClick={action('clicked')} dateClassName="form-control" />
  </div>
);
