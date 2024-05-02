import { SyntheticEvent, useContext, useState } from 'react'
import { FormProvider, useController, useForm, useFormContext } from 'react-hook-form'

import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'

import { type FlowChildrenProps } from '@/components/Flow'
import type { FieldTypes, FormFieldData, ValidationRules } from '@/components/Form'
import { PropertyPayload } from '@frigade/js'
import { FrigadeContext } from '@/components/Provider'

export interface FormStepProps extends FlowChildrenProps {
  fieldTypes?: FieldTypes
}

// See: https://react-hook-form.com/get-started#Applyvalidation
// NOTE: "validate" is intentionally omitted
const ruleProps = new Set(['required', 'min', 'max', 'minLength', 'maxLength', 'pattern'])

function FieldWrapper({ fieldComponent: FieldComponent, control, fieldData, submit }) {
  const formContext = useFormContext()

  // pattern validator comes as a string from YAML, convert it to RegExp
  if (fieldData.pattern != null) {
    if (typeof fieldData.pattern === 'string') {
      fieldData.pattern = new RegExp(fieldData.pattern.replace(/^\/|\/$/g, ''))
    } else if (
      typeof fieldData.pattern === 'object' &&
      typeof fieldData.pattern.value === 'string'
    ) {
      fieldData.pattern.value = new RegExp(fieldData.pattern.value.replace(/^\/|\/$/g, ''))
    }
  }

  const rules = Object.fromEntries(
    Object.entries(fieldData).filter(([key]) => ruleProps.has(key))
  ) as ValidationRules

  const controller = useController({
    name: fieldData.id,
    control,
    rules,
  })

  return (
    <FieldComponent
      {...controller}
      fieldData={fieldData}
      formContext={formContext}
      submit={submit}
    />
  )
}

export function FormStep({
  fieldTypes,
  handleDismiss,
  handlePrimary,
  handleSecondary,
  parentProps: { dismissible },
  step,
}: FormStepProps) {
  const { __readOnly } = useContext(FrigadeContext)
  const formContext = useForm({
    delayError: 2000,
    mode: 'onChange',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fields = []

  const { control, handleSubmit } = formContext

  const stepProps = step.props ?? {}

  function onPrimarySubmit(properties: PropertyPayload, e: SyntheticEvent<object, unknown>) {
    setIsSubmitting(true)
    handlePrimary(e, properties, __readOnly === true).then(() => setIsSubmitting(false))
  }

  // @ts-expect-error TODO: Add type to step.fields
  step.fields?.forEach((fieldData: FormFieldData) => {
    if (fieldTypes[fieldData.type] != null) {
      fields.push(
        <FieldWrapper
          key={`${step.flow.id}-${fieldData.id}`}
          control={control}
          fieldComponent={fieldTypes[fieldData.type]}
          fieldData={fieldData}
          submit={handleSubmit(onPrimarySubmit)}
        />
      )
    }
  })

  const primaryButtonTitle = step.primaryButton?.title ?? step.primaryButtonTitle
  const secondaryButtonTitle = step.secondaryButton?.title ?? step.secondaryButtonTitle

  const disabled = step.$state.completed || step.$state.blocked ? true : false

  return (
    <Flex.Column gap={5} part="form-step" {...stepProps}>
      <Card.Header
        dismissible={dismissible}
        handleDismiss={handleDismiss}
        part="form-step-header"
        subtitle={step.subtitle}
        title={step.title}
      />

      <FormProvider {...formContext}>{fields}</FormProvider>

      <Flex.Row key="form-footer" part="form-step-footer" justifyContent="flex-end" gap={3}>
        {secondaryButtonTitle && (
          <Button.Secondary
            disabled={disabled}
            onClick={handleSecondary}
            title={secondaryButtonTitle}
          />
        )}
        <Button.Primary
          disabled={disabled || isSubmitting}
          onClick={handleSubmit(onPrimarySubmit)}
          title={primaryButtonTitle ?? 'Submit'}
        />
      </Flex.Row>
    </Flex.Column>
  )
}
