import { Typography } from '@mui/material'
import StaticContentWrapper from '../../styles/Shared'
import { PALETTE } from '../../styles/Theme'
interface TableProps {
  items: Array<{
    item: string
    cost: number
  }>
}

const Table: React.FC<TableProps> = ({ items }) => {
  return (
    <table
      style={{
        border: `1px solid ${PALETTE.grayscale[900]}`,
        padding: '10px',
        color: PALETTE.grayscale[900],
      }}
    >
      <thead>
        <tr>
          <th>Item</th>
          <th>Monthly Cost</th>
        </tr>
      </thead>
      <tbody>
        {items.map((row, idx) => (
          <tr key={idx}>
            <td style={{ textAlign: 'left' }}>{row.item}</td>
            <td style={{ textAlign: 'right' }}>${row.cost.toFixed(2)}</td>
          </tr>
        ))}
        <tr>
          <td style={{ fontWeight: 'bold' }}>Total</td>
          <td style={{ fontWeight: 'bold', textAlign: 'right' }}>
            ${(items.reduce((acc, row) => acc + row.cost, 0) + 1).toFixed(2)}
          </td>
        </tr>
      </tbody>
    </table>
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
    <StaticContentWrapper>
      <Typography variant="h1">Donate</Typography>
      <Typography variant="body1">
        The project currently costs ${monthlyCost}/month or ${yearlyCost}/year to run. Below is a
        breakdown. At this point the costs are manageable for me. I have seen projects like this
        fall apart because of costs. If you would like to support the project, you can do so by
        donating.
      </Typography>
      <a href="https://www.patreon.com/c/photopalettes/membership">
        Support the project on Patreon
      </a>
      <Table items={items} />
    </StaticContentWrapper>
  )
}

export default Donations
