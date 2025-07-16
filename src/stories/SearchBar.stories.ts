import type { Meta, StoryObj } from '@storybook/react';
import SearchBar from '../components/SearchBar/SearchBar'

type SearchBarType = typeof SearchBar;

const meta: Meta<SearchBarType> = {
  title: 'Example/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<SearchBarType>;

export const Default: Story = {
  args: {},
};