'use client'

import {
  Table as MuiTable,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { PageTitle, PageWrapper } from '../../styles/Shared'
import { BORDER_RADIUS } from '../../styles/styleConsts'
import Link from '../sharedComponents/Link'

interface TableProps {
  items: Array<{
    item: string
    cost: number
  }>
}

const Table: React.FC<TableProps> = ({ items }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: BORDER_RADIUS.ZERO.PX }}>
      <MuiTable>
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell align="right">Monthly Cost</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{row.item}</TableCell>
              <TableCell align="right">${row.cost.toFixed(2)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align="right">
              ${(items.reduce((acc, row) => acc + row.cost, 0) + 1).toFixed(2)}
            </TableCell>
          </TableRow>
        </TableBody>
      </MuiTable>
    </TableContainer>
  )
}

const Donations = () => {
  const items = [
    { item: 'Domain', cost: 1 },
    { item: 'Frontend Hosting', cost: 7 },
    { item: 'Backend Hosting', cost: 7 },
    { item: 'Database', cost: 12 },
    { item: 'Email Sending', cost: 0 },
  ]

  const monthlyCost = items.reduce((acc, row) => acc + row.cost, 0)
  const yearlyCost = monthlyCost * 12

  return (
    <PageWrapper minHeight staticContent width="medium">
      <PageTitle text="Donate" />
      <Typography variant="body1">
        The project currently costs ${monthlyCost}/month or ${yearlyCost}/year to run. Below is a
        breakdown. At this point the costs are manageable for me. I have seen projects like this
        fall apart because of costs. If you would like to support the project, you can do so by
        donating.
      </Typography>
      <Link href="https://www.patreon.com/c/photopalettes/membership">
        Support the project on Patreon.
      </Link>
      <Table items={items} />
    </PageWrapper>
  )
}

export default Donations
