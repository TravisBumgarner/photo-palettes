'use client'

import { Typography } from '@mui/material'
import { StaticContentWrapper } from '../../styles/Shared'
import Link from '../sharedComponents/Link'

const Privacy = () => {
  return (
    <StaticContentWrapper>
      <Typography variant="h2">Privacy Policy</Typography>
      <Typography variant="body1">
        <em>Last updated: April 17, 2025</em>
      </Typography>

      <Typography variant="body1">
        Thank you for using our app. Your privacy is important to us, and we are committed to
        protecting your personal information. This Privacy Policy explains how we collect, use, and
        protect data in connection with our closed alpha app.
      </Typography>

      <Typography variant="h3">1. Information We Collect</Typography>
      <Typography variant="body1">
        During this closed alpha phase, we collect limited data to help us improve the app. This
        includes:
      </Typography>
      <ul>
        <li>
          <strong>Usage data</strong> collected via <strong>Google Analytics</strong>, such as pages
          visited, session duration, and basic technical details (device type, browser, etc.).
        </li>
        <li>
          <strong>Error and crash data</strong> collected via <strong>Sentry.io</strong>, which may
          include stack traces, device information, and actions leading up to an error.
        </li>
        <li>
          <strong>Anonymous identifiers</strong> provided by your browser or device, used solely to
          track usage trends.
        </li>
      </ul>
      <Typography variant="body1">
        We do <strong>not</strong> collect any personally identifiable information (PII), such as
        your name, email, or contact details, unless you provide them to us directly.
      </Typography>

      <Typography variant="h3">2. How We Use Your Information</Typography>
      <Typography variant="body1">We use the data collected to:</Typography>
      <ul>
        <li>Understand how testers use the app.</li>
        <li>Identify bugs, crashes, or usability issues.</li>
        <li>Improve the performance and design of the app.</li>
      </ul>

      <Typography variant="h3">3. Third-Party Services</Typography>
      <Typography variant="body1">
        We use <strong>Google Analytics</strong>, a web analytics service provided by Google LLC.
        Google Analytics uses cookies and similar technologies to collect and analyze information
        about your use of the app. Google may also use the collected data to contextualize and
        personalize ads on its own advertising network, though we do not enable advertising
        features.
      </Typography>
      <Typography variant="body1">
        To learn more about how Google collects and processes data, visit:
        <br />
        <Link href="https://policies.google.com/technologies/partner-sites" target="_blank">
          https://policies.google.com/technologies/partner-sites
        </Link>
      </Typography>
      <Typography variant="body1">
        You can opt out of Google Analytics tracking by installing the Google Analytics Opt-out
        Browser Add-on{' '}
        <Link href="https://tools.google.com/dlpage/gaoptout" target="_blank">
          https://tools.google.com/dlpage/gaoptout
        </Link>
      </Typography>

      <Typography variant="h3">4. Data Retention</Typography>
      <Typography variant="body1">
        We retain usage data for as long as necessary to analyze app performance and make
        improvements, or as required by our data processors (e.g., Google Analytics, Sentry.io).
      </Typography>

      <Typography variant="h3">5. Security</Typography>
      <Typography variant="body1">
        We take reasonable steps to protect your information, but please note that no system can be
        guaranteed 100% secure. Since this is an early-stage testing phase, we recommend not sharing
        sensitive information through the app.
      </Typography>

      <Typography variant="h3">6. Changes to This Policy</Typography>
      <Typography variant="body1">
        We may update this Privacy Policy from time to time. If we make significant changes, we’ll
        notify testers through the app or via email.
      </Typography>

      <Typography variant="h3">7. Contact Us</Typography>
      <Typography variant="body1">
        If you have any questions or concerns about this Privacy Policy, please contact us at:{' '}
        <Link href="mailto:support@photopalettes.com">support@photopalettes.com</Link>.
      </Typography>
    </StaticContentWrapper>
  )
}

export default Privacy
