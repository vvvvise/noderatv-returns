import { Meta, Story } from '@storybook/react';
import React from 'react';
import VideoGrid from './VideoGrid';

export default {
  title: 'Components/VideoGrid',
  component: VideoGrid,
} as Meta;

const Template: Story = (args) => <VideoGrid {...args} />;

export const Default = Template.bind({});
Default.args = {
  // 特に props がないので空でOK
};
