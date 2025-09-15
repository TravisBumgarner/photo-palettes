import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import PageTitle from '../styles/shared/PageTitle'
import PageWrapper from '../styles/shared/PageWrapper'

type Update = {
  title: string
  date: string
  updates: string[]
}

const Update = ({ title, date, updates }: Update) => {
  return (
    <Box>
      <Typography variant="h3">{title}</Typography>
      <Typography variant="body2">
        <time>{date}</time>
      </Typography>
      {updates.length > 0 && (
        <List>
          {updates.map((update) => (
            <ListItem key={update}>{update}</ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}

const UPDATES: Update[] = [
  {
    title: 'Open Beta Release',
    date: '2025-09-15',
    updates: [
      'Added: Two new color extraction algorithms - "Shades" and "Tints".',
      'Added: iOS App beta via TestFlight',
      'Added: Integration with Instagram to automatically post palettes when they are approved.',
      'Updated: Logged out color palette generation now runs much more quickly.',
      'Updated: "Overhauled "Browse Single Palette" experience now with lots more color details.',
      'Fix: Proper image scaling throughout the app across all browsers and devices.',
      'Fix: iOS photo palette download not working.',
    ],
  },
  {
    title: 'Feedback from Closed Alpha & Bug Fixes',
    date: '2025-08-27',
    updates: [
      'Added: iOS Alpha Release',
      'Added: Drag and reorder colors when creating a palette.',
      'Added: Add palettes to favorites list and view them.',
      'Added: Integration with Bluesky to automatically post palettes when they are approved.',
      'Added: Basic logged out functionality so visitors can create palettes without an account.',
      'Updated: Entire theme is now grayscale to emphasize color palettes and photos.',
      'Fix: Open graph image tag to be more friendly with aspect ratios of all sizes.',
      'Fix: Images scale correctly on Chrome and Safari.',
      'Fix: Pagination is consistent between Browse, Favorites, and Profile pages.',
    ],
  },
  {
    title: 'Mobile Improvements & Open Alpha Release',
    date: '2025-07-07',
    updates: [
      'Updated: Cleanup UI on mobile creation page.',
      'Updated: Improve process of selecting colors when creating photo palette.',
      'Updated: App is now in open alpha.',
    ],
  },
  {
    title: 'Closed Alpha Release',
    date: '2025-05-18',
    updates: [
      'Added: Basic sign up and log in flow',
      'Added: Create, browse, and moderate photo palettes',
      'Added: Generate color palettes from KMeans algorithm',
      'Added: Request new features',
      'Added: Give feedback',
      'Added: Privacy Policy & Terms of Service',
      'Added: Light and dark theme support',
    ],
  },
]

const ReleaseNotes = () => {
  return (
    <PageWrapper width="full" staticContent>
      <PageTitle text="Release Notes" />
      {UPDATES.map((update) => (
        <Update key={update.title + update.date} {...update} />
      ))}
    </PageWrapper>
  )
}

export default ReleaseNotes
