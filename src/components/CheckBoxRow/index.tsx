import React, { CSSProperties, FC } from 'react'
import styled from 'styled-components'
import { CheckBox, CheckBoxType } from '../CheckBox'
import { Appearance } from '../../types'
import { getClassName } from '../../shared/appearance'
import { RenderInlineStyles } from '../RenderInlineStyles'

interface CheckBoxRowProps {
  label?: string
  value: boolean
  labelStyle?: CSSProperties
  labelPosition?: 'left' | 'right'
  style?: CSSProperties
  primaryColor?: string
  secondaryColor?: string
  checkBoxType?: CheckBoxType
  appearance?: Appearance
}

const Label = styled.span`
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  color: #4d4d4d;
  display: inline-block;
  vertical-align: middle;
  margin-left: 12px;
  padding-right: 12px;
`

const CheckBoxRowContainer = styled.div`
  flex-direction: row;
  justify-content: space-between;
  display: flex;
  padding-top: 20px;
  padding-bottom: 20px;
  border-top: 1px solid ${(props) => props.theme.colorBorder};
  width: 100%;
`

export const CheckBoxRow: FC<CheckBoxRowProps> = ({
  label,
  value,
  labelStyle = {},
  labelPosition = 'right',
  style,
  primaryColor = '#000000',
  checkBoxType = 'round',
  appearance,
}) => {
  return (
    <>
      <CheckBoxRowContainer
        className={getClassName('checklistStepsContainer', appearance)}
        appearance={appearance}
        style={{ ...style }}
      >
        {labelPosition === 'left' && label && (
          <Label className={getClassName('checklistStepLabel', appearance)} style={labelStyle}>
            {label}
          </Label>
        )}
        <CheckBox
          appearance={appearance}
          value={value}
          type={checkBoxType}
          primaryColor={primaryColor}
        />
        {labelPosition === 'right' && label && (
          <Label className={getClassName('checklistStepLabel', appearance)} style={labelStyle}>
            {label}
          </Label>
        )}
      </CheckBoxRowContainer>
      <RenderInlineStyles appearance={appearance} />
    </>
  )
}
