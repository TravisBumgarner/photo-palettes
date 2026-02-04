import { Component, type ReactNode } from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import PageWrapper from '../styles/shared/PageWrapper'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ChunkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  handleRefresh = () => {
    sessionStorage.removeItem('chunk-refresh')
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <PageWrapper minHeight verticallyAlign width="small" staticContent>
          <Typography variant="h2">Page Load Error</Typography>
          <Typography sx={{ mb: 2 }}>
            We couldn't load this page. This usually happens after an update.
          </Typography>
          <Button variant="contained" onClick={this.handleRefresh}>
            Refresh Page
          </Button>
        </PageWrapper>
      )
    }

    return this.props.children
  }
}

export default ChunkErrorBoundary
