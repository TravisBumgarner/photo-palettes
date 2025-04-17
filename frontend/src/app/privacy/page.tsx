const Privacy = () => {
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
      <h1>Privacy Policy</h1>
      <p>
        <em>Last updated: April 17, 2025</em>
      </p>

      <p>
        Thank you for using our app. Your privacy is important to us, and we are committed to
        protecting your personal information. This Privacy Policy explains how we collect, use, and
        protect data in connection with our closed alpha app.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        During this closed alpha phase, we collect limited data to help us improve the app. This
        includes:
      </p>
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
      <p>
        We do <strong>not</strong> collect any personally identifiable information (PII), such as
        your name, email, or contact details, unless you provide them to us directly.
      </p>

      <h2>2. How We Use Your Information</h2>
      <p>We use the data collected to:</p>
      <ul>
        <li>Understand how testers use the app.</li>
        <li>Identify bugs, crashes, or usability issues.</li>
        <li>Improve the performance and design of the app.</li>
      </ul>

      <h2>3. Third-Party Services</h2>
      <p>
        We use <strong>Google Analytics</strong>, a web analytics service provided by Google LLC.
        Google Analytics uses cookies and similar technologies to collect and analyze information
        about your use of the app. Google may also use the collected data to contextualize and
        personalize ads on its own advertising network, though we do not enable advertising
        features.
      </p>
      <p>
        To learn more about how Google collects and processes data, visit:
        <br />
        <a
          href="https://policies.google.com/technologies/partner-sites"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://policies.google.com/technologies/partner-sites
        </a>
      </p>
      <p>
        You can opt out of Google Analytics tracking by installing the Google Analytics Opt-out
        Browser Add-on{' '}
        <a
          href="https://tools.google.com/dlpage/gaoptout"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://tools.google.com/dlpage/gaoptout
        </a>
      </p>

      <h2>4. Data Retention</h2>
      <p>
        We retain usage data for as long as necessary to analyze app performance and make
        improvements, or as required by our data processors (e.g., Google Analytics, Sentry.io).
      </p>

      <h2>5. Security</h2>
      <p>
        We take reasonable steps to protect your information, but please note that no system can be
        guaranteed 100% secure. Since this is an early-stage testing phase, we recommend not sharing
        sensitive information through the app.
      </p>

      <h2>6. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. If we make significant changes, we’ll
        notify testers through the app or via email.
      </p>

      <h2>7. Contact Us</h2>
      <p>
        If you have any questions or concerns about this Privacy Policy, please contact us at:{' '}
        <a href="mailto:support@photopalettes.com">support@photopalettes.com</a>.
      </p>
    </div>
  )
}

export default Privacy
