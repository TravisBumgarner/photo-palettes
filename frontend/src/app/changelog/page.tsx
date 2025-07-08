import { Box, Typography } from '@mui/material'
import { PageTitle, PageWrapper } from '../../styles/Shared'
import { SPACING } from '../../styles/styleConsts'

type Update = {
  title: string
  summary: string
  date: string
  updates: string[]
}

const Update = ({ title, summary, date, updates }: Update) => {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', padding: SPACING.MEDIUM.PX }}>
      <Typography variant="h3">{title}</Typography>
      <Typography variant="body2">
        <time>{date}</time>
      </Typography>
      <Typography>{summary}</Typography>
      {updates.length > 0 && (
        <ul>
          {updates.map(update => (
            <li key={update}>{update}</li>
          ))}
        </ul>
      )}
    </Box>
  )
}

const UPDATES: Update[] = [
  {
    title: 'Mobile Improvements',
    date: '2025-07-08',
    summary:
      'I tested the mobile experience when creating photo palettes today and it was unusable. This update fixes the mobile experience and makes the overall experience better.',
    updates: [
      "Can't scroll while on mobile.",
      'Make it easier to use the color picker to select a specific pixel.',
    ],
  },
  {
    title: 'Closed Alpha Release',
    date: '2025-05-18',
    summary: 'This is the initial launch of Photo Palettes for internal testing.',
    updates: [
      'Basic sign up and log in flow',
      'Create, browse, and moderate photo palettes',
      'Generate color palettes from KMeans algorithm',
      'Request new features',
      'Give feedback',
      'Privacy Policy & Terms of Service',
      'Light and dark theme support',
    ],
  },
]

const Changelog = () => {
  return (
    <PageWrapper width="medium" staticContent>
      <PageTitle text="Changelog" />
      {UPDATES.map(update => (
        <Update key={update.title + update.date} {...update} />
      ))}
    </PageWrapper>
  )
}

export default Changelog
