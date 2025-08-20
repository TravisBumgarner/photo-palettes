import React, { useCallback, useMemo, useState } from 'react'
import { PAGINATION_SIZE } from '../../consts'
import { Button } from '@mui/material'

interface PaginationProps {
  total: number
  onPageChange: (page: number) => void
}

const PageNumber = ({
  page,
  isActive,
  handlePage,
}: {
  page: number
  isActive: boolean
  handlePage: (page: number) => void
}) => {
  const handleOnClick = useCallback(() => {
    handlePage(page)
  }, [handlePage, page])

  return (
    <Button
      variant="outlined"
      onClick={handleOnClick}
      style={{
        fontWeight: isActive ? 'bold' : 'normal',
        margin: '0 4px',
        border: isActive ? '2px solid' : 'none',
      }}
    >
      {page}
    </Button>
  )
}

const Pagination: React.FC<PaginationProps> = ({ total, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(total / PAGINATION_SIZE)

  const handlePrev = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      onPageChange?.(currentPage - 1)
    }
  }, [currentPage, onPageChange])

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      onPageChange?.(currentPage + 1)
    }
  }, [currentPage, onPageChange, totalPages])

  const handlePage = useCallback(
    (page: number) => {
      setCurrentPage(page)
      onPageChange?.(page)
    },
    [onPageChange]
  )

  // Show up to 5 page numbers, with ellipsis if needed
  const pageNumbers = useMemo(() => {
    const pages = []
    let start = Math.max(1, currentPage - 2)
    let end = Math.min(totalPages, currentPage + 2)
    if (currentPage <= 3) end = Math.min(5, totalPages)
    if (currentPage >= totalPages - 2) start = Math.max(1, totalPages - 4)
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }, [currentPage, totalPages])

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: '16px 0',
      }}
    >
      <Button variant="outlined" onClick={handlePrev} disabled={currentPage === 1}>
        &laquo; Prev
      </Button>
      {pageNumbers[0] > 1 && <span>...</span>}
      {pageNumbers.map(page => (
        <PageNumber
          key={page}
          page={page}
          isActive={page === currentPage}
          handlePage={handlePage}
        />
      ))}
      {pageNumbers[pageNumbers.length - 1] < totalPages && <span>...</span>}
      <Button variant="outlined" onClick={handleNext} disabled={currentPage === totalPages}>
        Next &raquo;
      </Button>
    </div>
  )
}

export default Pagination
