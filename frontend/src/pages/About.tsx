import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { FaApple, FaFigma } from 'react-icons/fa'
import { IoLogoAndroid } from 'react-icons/io'
import { ROUTES } from '../consts'
import Link from '../sharedComponents/Link'
import PageTitle from '../styles/shared/PageTitle'
import PageWrapper from '../styles/shared/PageWrapper'
import { SPACING, subtleBackground } from '../styles/styleConsts'

const PlatformCard = ({
  icon,
  title,
  description,
  href,
  comingSoon,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href?: string
  comingSoon?: boolean
}) => {
  const theme = useTheme()

  return (
    <Paper
      sx={{
        padding: SPACING.MEDIUM.PX,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: SPACING.SMALL.PX,
        backgroundColor: subtleBackground(theme.palette.mode),
        flex: 1,
        minWidth: '150px',
      }}
      elevation={0}
    >
      <Box sx={{ fontSize: '2rem' }}>{icon}</Box>
      <Typography variant="h6" component="h3">
        {title}
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'center' }}>
        {description}
      </Typography>
      {comingSoon ? (
        <Typography
          variant="body2"
          sx={{ fontStyle: 'italic', opacity: 0.7, marginTop: 'auto' }}
        >
          Coming Soon
        </Typography>
      ) : href ? (
        <Link href={href} target="_blank" sx={{ marginTop: 'auto' }}>
          Learn More
        </Link>
      ) : null}
    </Paper>
  )
}

const ScreenshotPlaceholder = ({ label }: { label: string }) => {
  const theme = useTheme()

  return (
    <Paper
      sx={{
        padding: SPACING.LARGE.PX,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: subtleBackground(theme.palette.mode),
        minHeight: '200px',
        flex: 1,
        minWidth: '250px',
      }}
      elevation={0}
    >
      <Typography variant="body2" sx={{ opacity: 0.5 }}>
        {label}
      </Typography>
    </Paper>
  )
}

const About = () => {
  return (
    <PageWrapper minHeight staticContent width="medium">
      {/* Hero Section */}
      <PageTitle text="Photo Palettes" center />
      <Typography variant="body1" sx={{ textAlign: 'center' }}>
        Generate beautiful color palettes from your photos. Whether you're a
        designer, artist, or just love colors, Photo Palettes helps you extract
        and share stunning color combinations from any image.
      </Typography>

      {/* Platform Availability Section */}
      <Typography variant="h4" component="h2" sx={{ marginTop: SPACING.LARGE.PX }}>
        Available On
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: SPACING.MEDIUM.PX,
          flexWrap: 'wrap',
        }}
      >
        <PlatformCard
          icon={<FaApple />}
          title="iOS App"
          description="Download from the App Store for iPhone and iPad."
          href={ROUTES.apple.href}
        />
        <PlatformCard
          icon={<FaFigma />}
          title="Figma Plugin"
          description="Use Photo Palettes directly in your Figma projects."
          href={ROUTES.figma.href}
        />
        <PlatformCard
          icon={<IoLogoAndroid />}
          title="Android App"
          description="Native Android app for your phone and tablet."
          comingSoon
        />
      </Box>

      {/* Screenshot Placeholders */}
      <Typography variant="h4" component="h2" sx={{ marginTop: SPACING.LARGE.PX }}>
        See It In Action
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: SPACING.MEDIUM.PX,
          flexWrap: 'wrap',
        }}
      >
        <ScreenshotPlaceholder label="Screenshot: Upload a photo" />
        <ScreenshotPlaceholder label="Screenshot: Extract colors" />
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: SPACING.MEDIUM.PX,
          flexWrap: 'wrap',
        }}
      >
        <ScreenshotPlaceholder label="Screenshot: Save and share" />
        <ScreenshotPlaceholder label="Screenshot: Browse palettes" />
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: SPACING.MEDIUM.PX,
          marginTop: SPACING.LARGE.PX,
        }}
      >
        <Typography variant="h4" component="h2">
          Get Started
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center' }}>
          Create your free account to save palettes and join our community.
        </Typography>
        <Box sx={{ display: 'flex', gap: SPACING.MEDIUM.PX, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            component={Link}
            href={ROUTES.signup.href}
            sx={{ textDecoration: 'none' }}
          >
            Sign Up
          </Button>
          <Button
            variant="outlined"
            component={Link}
            href={ROUTES.browse.href}
            sx={{ textDecoration: 'none' }}
          >
            Browse Palettes
          </Button>
        </Box>
      </Box>
    </PageWrapper>
  )
}

export default About
