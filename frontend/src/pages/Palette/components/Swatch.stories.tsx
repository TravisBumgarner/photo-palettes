import Box from '@mui/material/Box'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { TSwatch } from '../../../types'
import Swatch from './Swatch'

const meta = {
  title: 'Example/Swatch',
  component: Swatch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Swatch>

export default meta
type Story = StoryObj<typeof meta>

export const SwatchStory: Story = {
  args: {
    colorMode: 'hex',
    swatch: {
      percentLocation: [0, 0],
      id: 'default',
      hex: '#4A90E2',
      r: 74,
      g: 144,
      b: 226,
      name: 'Blue',
    },
  },
  render: () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      <Swatch
        colorMode="hex"
        swatch={
          {
            percentLocation: [0, 0],
            id: 'swatch1',
            hex: '#000000',
            r: 74,
            g: 144,
            b: 226,
            name: 'Black',
          } as TSwatch
        }
      />
      <Swatch
        colorMode="hex"
        swatch={
          {
            percentLocation: [0, 0],
            id: 'swatch1',
            hex: '#424242',
            r: 74,
            g: 144,
            b: 226,
            name: 'Gray',
          } as TSwatch
        }
      />
      <Swatch
        colorMode="hex"
        swatch={
          {
            percentLocation: [0, 0],
            id: 'swatch2',
            hex: '#FFFFFF',
            r: 208,
            g: 2,
            b: 27,
            name: 'White',
          } as TSwatch
        }
      />
      <Swatch
        colorMode="hex"
        swatch={
          {
            percentLocation: [0, 0],
            id: 'swatch3',
            hex: '#FF5733',
            r: 255,
            g: 87,
            b: 51,
            name: 'Orange',
          } as TSwatch
        }
      />
      <Swatch
        colorMode="hex"
        swatch={
          {
            percentLocation: [0, 0],
            id: 'swatch3',
            hex: '#836833',
            r: 255,
            g: 87,
            b: 51,
            name: 'Brown',
          } as TSwatch
        }
      />
      <Swatch
        colorMode="hex"
        swatch={
          {
            percentLocation: [0, 0],
            id: 'swatch4',
            hex: '#C5CCD3',
            r: 74,
            g: 144,
            b: 226,
            name: 'Light Gray',
          } as TSwatch
        }
      />
    </Box>
  ),
}
