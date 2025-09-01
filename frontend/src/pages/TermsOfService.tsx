import Typography from '@mui/material/Typography'
import PageTitle from '../styles/shared/PageTitle'
import PageWrapper from '../styles/shared/PageWrapper'
import Link from '../sharedComponents/Link'

const TermsOfService = () => {
  return (
    <PageWrapper width="medium" staticContent>
      <PageTitle text="Terms of Service" />
      <Typography variant="body1">
        <em>Last updated: May 21, 2025</em>
      </Typography>

      <Typography variant="h3">1. Use of the Service</Typography>
      <Typography variant="body1">
        You may use Photo Palettes to upload photos and generate color palettes
        for personal or commercial use. You are responsible for ensuring that
        any content you upload complies with applicable laws and that you have
        the rights to use and upload that content.
      </Typography>

      <Typography variant="h3">2. User Content & Sharing</Typography>
      <Typography variant="body1">
        You retain all rights to the photos you upload. By uploading content,
        you grant us a limited, non-exclusive, worldwide, royalty-free license
        to display, distribute, and share your content within the Photo Palettes
        platform and on third-party platforms for the purpose of enabling
        discovery, sharing, and social features.
      </Typography>
      <Typography variant="body1">
        Photo Palettes is a social platform. This means content you upload will
        be visible to other users, who can like, share, or comment on it. Public
        photos and their associated palettes may be featured on the site or
        shared around the internet via social feeds, newsletters, or
        integrations with third-party platforms.
      </Typography>

      <Typography variant="h3">3. Restrictions</Typography>
      <Typography variant="body1">
        You agree not to use the Service to:
      </Typography>
      <ul>
        <li>Upload illegal, obscene, or infringing content.</li>
        <li>Upload content that is not your own.</li>
        <li>Upload AI-generated content.</li>
        <li>Interfere with or disrupt the service.</li>
        <li>Attempt to reverse engineer or misuse any part of the platform.</li>
      </ul>

      <Typography variant="h3">4. Intellectual Property</Typography>
      <Typography variant="body1">
        All rights in the Photo Palettes platform, including design, software,
        and branding, are owned by us or our licensors. You may not copy,
        distribute, or create derivative works without our written permission.
      </Typography>

      <Typography variant="h3">5. Termination</Typography>
      <Typography variant="body1">
        We may suspend or terminate your access to the Service at any time if we
        reasonably believe you have violated these Terms.
      </Typography>

      <Typography variant="h3">6. Disclaimer</Typography>
      <Typography variant="body1">
        The Service is provided “as is” without warranties of any kind. We do
        not guarantee the accuracy of color extractions or that the Service will
        be available at all times.
      </Typography>

      <Typography variant="h3">7. Limitation of Liability</Typography>
      <Typography variant="body1">
        To the extent permitted by law, we shall not be liable for any indirect
        or consequential damages resulting from your use of the Service.
      </Typography>

      {/* <Typography variant="h3">8. Changes</Typography>
      <Typography variant="body1">
        We may update these Terms from time to time. If we make material changes, we’ll notify you
        through the Service or via email.
      </Typography> */}

      <Typography variant="h3">8. Contact</Typography>
      <Typography variant="body1">
        If you have questions or concerns, contact us at{' '}
        <Link href="mailto:support@photopalettes.com">
          support@photopalettes.com
        </Link>
        .
      </Typography>
    </PageWrapper>
  )
}

export default TermsOfService
