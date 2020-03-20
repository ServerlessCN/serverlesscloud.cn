import * as React from 'react'
import { Text, TextProps } from '@src/components/atoms'
import theme from '@src/constants/theme'

const defaultColor = theme.colors.black

interface Props extends React.Props<any> {
  color?: string
}

export function MainTitle({
  children,
  color = defaultColor,
  ...rest
}: Props & TextProps) {
  return (
    <Text
      my="20px"
      color={color}
      align={['center', 'center', 'center', 'left']}
      fontSize={[
        theme.fontSizes[0],
        theme.fontSizes[0],
        theme.fontSizes[1],
        theme.fontSizes[2],
        theme.fontSizes[3],
      ]}
      {...rest}
    >
      {children}
    </Text>
  )
}

export function SubMainTitle({ children, color = defaultColor }: Props) {
  return (
    <Text color={color} fontSize={['1rem', '1rem', '1rem', theme.fontSizes[0]]}>
      {children}
    </Text>
  )
}
