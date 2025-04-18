interface TableProps {
  items: Array<{
    item: string
    cost: number
  }>
}

const linkStyle = {
  color: '#bd4e85',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}

const Table: React.FC<TableProps> = ({ items }) => {
  return (
    <table style={{ border: '1px solid var(--foreground)', padding: '10px' }}>
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
      <h1>Donations</h1>
      <p>
        The project currently costs ${monthlyCost}/month or ${yearlyCost}/year to run. Below is a
        breakdown. At this point the costs are manageable for me. I have seen projects like this
        fall apart because of costs. If you would like to support the project, you can do so by
        donating.
      </p>
      <a style={linkStyle} href="https://www.patreon.com/c/photopalettes/membership">
        Support the project on Patreon
      </a>
      <Table items={items} />
    </div>
  )
}

export default Donations
