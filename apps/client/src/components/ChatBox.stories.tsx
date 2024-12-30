import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import ChatBox from './ChatBox';

export default {
  title: 'Components/ChatBox',
  component: ChatBox,
} as Meta;

const Template: StoryFn = (args) => <ChatBox {...args} />;

export const Default = Template.bind({});
Default.args = {};
