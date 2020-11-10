import React from 'react'
import { Platform, Linking } from 'react-native'
import { useHistory } from 'react-router-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from './../Div'
import Button from './../Button'
import Span from './../typography/Span'
import './index.styl'

const isWeb = Platform.OS === 'web'
const EXTERNAL_LINK_REGEXP = /^(https?:\/\/|\/\/)/i

function Link ({
  style,
  to,
  color,
  theme,
  bold,
  italic,
  block,
  replace,
  variant,
  children,
  onPress,
  ...props
}) {
  const Component = block ? Div : Span
  const extraProps = { accessibilityRole: 'link' }
  const history = useHistory()

  function handlePress (event) {
    try {
      if (onPress) onPress(event)
    } catch (err) {
      event.preventDefault()
      throw err
    }

    if (!event.defaultPrevented) {
      if (isWeb) {
        // ignore clicks with modifier keys
        // let browser handle these clicks
        if (isModifiedEvent(event)) return
        // prevent default browser behavior
        // because we need to use a react router
        event.preventDefault()
      }

      if (EXTERNAL_LINK_REGEXP.test(to)) {
        isWeb
          ? window.open(to, '_blank')
          : Linking.openURL(to)
      } else {
        const method = replace ? history.replace : history.push
        method(to)
      }
    }
  }

  if (block) {
    extraProps.variant = variant

    try {
      // it throws an error if children has more then one child
      React.Children.only(children)
      // originalType is using for component in MDX docs
      if (children.props.originalType === Button || children.type === Button) {
        extraProps.hoverStyle = {}
        extraProps.activeStyle = {}
        children = React.cloneElement(children, { onPress: () => {} })
      }
    } catch (e) {}
  }

  // modifier keys does not work without href attribute
  if (isWeb) extraProps.href = to

  return pug`
    Component.root(
      style=style
      styleName=[theme, color, { block }]
      bold=bold
      italic=italic
      onPress=handlePress
      ...extraProps
      ...props
    )= children
  `
}

function isModifiedEvent (event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

Link.defaultProps = {
  bold: Span.defaultProps.bold,
  italic: Span.defaultProps.italic,
  replace: false,
  block: false,
  color: 'default'
}

Link.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  bold: Span.propTypes.bold,
  italic: Span.propTypes.italic,
  children: PropTypes.node,
  to: PropTypes.string.isRequired,
  replace: PropTypes.bool,
  block: PropTypes.bool,
  color: PropTypes.oneOf(['default', 'primary'])
}

export default observer(Link)
