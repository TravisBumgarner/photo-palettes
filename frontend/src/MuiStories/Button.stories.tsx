import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, Button } from '@mui/material'

const meta = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
    {children}
  </Box>
)

export const Info: Story = {
  render: () => (
    <Wrapper>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="text">Text</Button>
      <Button disabled variant="contained">
        Disabled Contained
      </Button>
      <Button disabled variant="outlined">
        Disabled Outlined
      </Button>
      <Button disabled variant="text">
        Disabled Text
      </Button>
    </Wrapper>
  ),
}
