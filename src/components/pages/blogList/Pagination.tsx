import * as React from 'react'
import { Flex, Box } from '@src/components/atoms'
import theme from '@src/constants/theme'
import styled from 'styled-components'
import Pagination from 'react-js-pagination'

const PaginationWrapper = styled(Flex)`
  ul {
    display: flex;

    .active {
      a {
        color: ${theme.colors.serverlessRed};
      }
    }

    a {
      transition: all 0.3s ease;
    }

    li {
      a:focus {
        outline: none;
      }
      margin: 0 10px;

      &:hover {
        a {
          color: ${theme.colors.serverlessRed};
        }
      }
    }
  }
`

export default function({
  currentPage,
  totalCount,
  pageSize,
  onChange,
  getPageUrl,
}: {
  currentPage: number
  totalCount: number
  pageSize: number
  onChange?: (pageNum: number) => void
  getPageUrl?: (pageNum: number) => string
}) {
  const _onChange = (pageNum: number) => {
    onChange && onChange(pageNum)
  }

  const _getPageUrl = (pageNum: number) => {
    return (getPageUrl && getPageUrl(pageNum)) || ''
  }

  return (
    <Box mt="40px" mb="40px">
      <PaginationWrapper justifyContent="center">
        <Pagination
          onChange={_onChange}
          totalItemsCount={totalCount}
          pageRangeDisplayed={8}
          activePage={currentPage}
          getPageUrl={_getPageUrl}
          itemsCountPerPage={pageSize}
          firstPageText={<noscript />}
          lastPageText={<noscript />}
          prevPageText={'上一页'}
          nextPageText={'下一页'}
        />
      </PaginationWrapper>
    </Box>
  )
}
