import React from 'react'
import propTypes from 'prop-types'
import { TouchableOpacity, View } from 'react-native'
import { observer } from 'startupjs'
import SHADOWS from './shadows'
import './index.styl'
function Div ({
  style,
  children,
  level,
  onPress,
  ...props
}) {
  let Wrapper = typeof onPress === 'function'
    ? TouchableOpacity
    : View

  return pug`
    Wrapper.root(
      style=[style, SHADOWS[level]]
      styleName=[{ 'with-shadow': !!level }]
      onPress=onPress
      ...props
    )
      = children
  `
}

Div.defaultProps = {
  level: 0
}

Div.propTypes = {
  level: propTypes.oneOf(Object.keys(SHADOWS)),
  onPress: propTypes.func
}

export default observer(Div)
