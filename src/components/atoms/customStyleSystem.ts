import { style, ResponsiveValue } from 'styled-system'
import * as CSS from 'csstype'

const align = style({
  prop: 'align',
  cssProperty: 'text-align',
})

interface TextAlignProps {
  align?: ResponsiveValue<CSS.TextAlignProperty>
}

const styleType = style({
  prop: 'styleType',
  cssProperty: 'list-style-type',
})

interface ListStyleTypeProps {
  styleType?: ResponsiveValue<CSS.ListStyleTypeProperty>
}

const boxSizing = style({
  prop: 'boxSizing',
  cssProperty: 'box-sizing',
})

interface BoxSizingProps {
  boxSizing?: ResponsiveValue<CSS.BoxSizingProperty>
}

const textDecoration = style({
  prop: 'textDecoration',
  cssProperty: 'text-decoration',
})

interface TextDecorationProps<T = string> {
  textDecoration?: ResponsiveValue<CSS.TextDecorationProperty<T>>
}

export {
  align,
  styleType,
  boxSizing,
  textDecoration,
  BoxSizingProps,
  ListStyleTypeProps,
  TextDecorationProps,
  TextAlignProps,
}
