import React, { useState } from 'react'
import { observer } from 'startupjs'
import { View } from 'react-native'
import Input from './input'
import Span from './../Span'
import propTypes from 'prop-types'
import './index.styl'

function TextInput ({
  label,
  placeholder,
  value,
  pure,
  disabled,
  onBlur,
  onFocus,
  ...props
}) {
  const [focused, setFocused] = useState(false)

  function _onBlur () {
    setFocused(false)
  }

  function _onFocus () {
    if (disabled) return
    setFocused(true)
  }

  function renderInput () {
    return pug`
      Input(
        value=value
        placeholder=placeholder
        disabled=disabled
        focused=focused
        onBlur=(...args) => {
          _onBlur()
          onBlur && onBlur(...args)
        }
        onFocus=(...args) => {
          _onFocus()
          onFocus && onFocus(...args)
        }
        ...props
      )
    `
  }

  if (pure) return renderInput()

  return pug`
    View.root
      Span.label(
        styleName={focused}
        size='s'
      )= label || (value && placeholder) || ' '
      = renderInput()
  `
}

TextInput.defaultProps = {
  size: 'm',
  value: '', // default value is important to prevent error
  pure: false,
  disabled: false,
  resize: false,
  numberOfLines: 1
}

TextInput.propTypes = {
  style: propTypes.object,
  label: propTypes.string,
  placeholder: propTypes.string.isRequired,
  value: propTypes.string,
  size: propTypes.oneOf(['l', 'm', 's']),
  pure: propTypes.bool,
  disabled: propTypes.bool,
  resize: propTypes.bool,
  numberOfLines: propTypes.number,
  icon: propTypes.object,
  onBlur: propTypes.func,
  onFocus: propTypes.func
}

export default observer(TextInput)