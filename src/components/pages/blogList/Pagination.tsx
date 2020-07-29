import * as React from 'react'
import { Flex, Box } from '@src/components/atoms'
import theme from '@src/constants/theme'
import styled from 'styled-components'
import Pagination from 'react-paginate'

const PaginationWrapper = styled(Flex)`
  ul {
    display: flex;

    .active {
      a {
        color: ${theme.colors.tencentTheme};
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
          color: ${theme.colors.tencentTheme};
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
  const _onChange = (selectedItem: { selected: number }) => {
    onChange && onChange(selectedItem.selected + 1)
  }

  const _getPageUrl = (pageNum: number) => {
    return (getPageUrl && getPageUrl(pageNum)) || ''
  }

  return (
    <Box mt="40px" mb="40px">
      <PaginationWrapper justifyContent="center" className="pagination">
        <Pagination
          onPageChange={_onChange}
          pageCount={Math.ceil(totalCount / 10)}
          pageRangeDisplayed={3}
          initialPage={currentPage - 1}
          marginPagesDisplayed={2}
          disableInitialCallback={true}
          activeClassName="active"
          previousLabel={null}
          nextLabel={null}
          // getPageUrl={_getPageUrl}
        />
      </PaginationWrapper>
    </Box>
  )
}
