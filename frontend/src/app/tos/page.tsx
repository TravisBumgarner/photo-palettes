const TermsOfService = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        maxWidth: '800px',
        margin: '0px auto',
        padding: '20px',
        boxSizing: 'border-box',
        fontSize: '30px',
        color: '#222',
      }}
    >
      <h1>Terms of Service</h1>
      <p>
        <em>Last updated: April 17, 2025</em>
      </p>

      <h2>1. Use of the Service</h2>
      <p>
        You may use Photo Palettes to upload images and generate color palettes for personal or
        commercial use. You are responsible for ensuring that any content you upload complies with
        applicable laws and that you have the rights to use and upload that content.
      </p>

      <h2>2. User Content & Sharing</h2>
      <p>
        You retain all rights to the images you upload. By uploading content, you grant us a
        limited, non-exclusive, worldwide, royalty-free license to display, distribute, and share
        your content within the Photo Palettes platform and on third-party platforms for the purpose
        of enabling discovery, sharing, and social features.
      </p>
      <p>
        Photo Palettes is a social platform. This means content you upload will be visible to other
        users, who can like, share, or comment on it. Public images and their associated palettes
        may be featured on the site or shared around the internet via social feeds, newsletters, or
        integrations with third-party platforms.
      </p>

      <h2>3. Restrictions</h2>
      <p>You agree not to use the Service to:</p>
      <ul>
        <li>Upload illegal, obscene, or infringing content.</li>
        <li>Upload content that is not your own.</li>
        <li>Upload AI-generated content.</li>
        <li>Interfere with or disrupt the service.</li>
        <li>Attempt to reverse engineer or misuse any part of the platform.</li>
      </ul>

      <h2>4. Intellectual Property</h2>
      <p>
        All rights in the Photo Palettes platform, including design, software, and branding, are
        owned by us or our licensors. You may not copy, distribute, or create derivative works
        without our written permission.
      </p>

      <h2>5. Termination</h2>
      <p>
        We may suspend or terminate your access to the Service at any time if we reasonably believe
        you have violated these Terms.
      </p>

      <h2>6. Disclaimer</h2>
      <p>
        The Service is provided “as is” without warranties of any kind. We do not guarantee the
        accuracy of color extractions or that the Service will be available at all times.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        To the extent permitted by law, we shall not be liable for any indirect or consequential
        damages resulting from your use of the Service.
      </p>

      <h2>8. Changes</h2>
      <p>
        We may update these Terms from time to time. If we make material changes, we’ll notify you
        through the Service or via email.
      </p>

      <h2>9. Contact</h2>
      <p>
        If you have questions or concerns, contact us at{' '}
        <a href="mailto:support@photopalettes.com">support@photopalettes.com</a>.
      </p>
    </div>
  )
}

export default TermsOfService
