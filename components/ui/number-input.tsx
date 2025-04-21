import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

const NumberInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<'input'>, 'onChange' | 'type' | 'value'> & {
    onChange: (value: number) => void
    initialValue: number
    allowDecimal?: boolean
    maxDecimals?: number
    min?: number
    max?: number
  }
>(
  (
    {
      className,
      onChange,
      initialValue,
      allowDecimal = true,
      maxDecimals,
      min,
      max,
      ...props
    },
    ref,
  ) => {
    const [textValue, setTextValue] = useState<string>(initialValue.toString())

    // Update text value when initialValue changes
    useEffect(() => {
      setTextValue(initialValue.toString())
    }, [initialValue])

    const validateInput = useCallback(
      (value: string): boolean => {
        if (value === '' || value === '-') return true

        const regex = allowDecimal ? /^-?\d*\.?\d*$/ : /^-?\d*$/

        // Basic regex validation first
        if (!regex.test(value)) return false

        // If maxDecimals is set and we have a decimal point, check decimal places
        if (allowDecimal && maxDecimals !== undefined && value.includes('.')) {
          const parts = value.split('.')
          if (parts.length === 2 && parts[1].length > maxDecimals) {
            return false
          }
        }

        return true
      },
      [allowDecimal, maxDecimals],
    )

    const formatValue = useCallback(
      (value: string): string => {
        if (value === '' || value === '-' || value === '.') return value

        let formattedValue = value

        // Apply decimal places constraint if needed
        if (allowDecimal && maxDecimals !== undefined && value.includes('.')) {
          const parts = value.split('.')
          if (parts.length === 2) {
            formattedValue = `${parts[0]}.${parts[1].substring(0, maxDecimals)}`
          }
        }

        return formattedValue
      },
      [allowDecimal, maxDecimals],
    )

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value

        // Allow valid input including temporary states like '-', '.', or empty
        if (validateInput(newValue)) {
          const formattedValue = formatValue(newValue)
          setTextValue(formattedValue)

          // Only update parent if we have a valid number
          if (
            formattedValue !== '' &&
            formattedValue !== '-' &&
            formattedValue !== '.'
          ) {
            const numberValue = Number(formattedValue)

            // Apply min/max constraints if specified
            let constrainedValue = numberValue
            if (min !== undefined && numberValue < min) constrainedValue = min
            if (max !== undefined && numberValue > max) constrainedValue = max

            // Only update if the value is different from the constrained value
            if (constrainedValue !== numberValue) {
              setTextValue(constrainedValue.toString())
            }

            onChange(constrainedValue)
          }
        }
      },
      [onChange, validateInput, formatValue, min, max],
    )

    // Handle blur to ensure we always have a valid number
    const handleBlur = useCallback(() => {
      if (textValue === '' || textValue === '-' || textValue === '.') {
        setTextValue(initialValue.toString())
        return
      }

      let numberValue = Number(textValue)

      // Apply constraints
      if (min !== undefined && numberValue < min) numberValue = min
      if (max !== undefined && numberValue > max) numberValue = max

      // Format the final value with decimal places constraint
      let formattedValue = numberValue.toString()
      if (
        allowDecimal &&
        maxDecimals !== undefined &&
        formattedValue.includes('.')
      ) {
        numberValue = Number(numberValue.toFixed(maxDecimals))
        formattedValue = numberValue.toString()
      }

      // Update with the validated value
      setTextValue(formattedValue)
      onChange(numberValue)
    }, [textValue, onChange, initialValue, min, max, allowDecimal, maxDecimals])

    return (
      <input
        type="text"
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
        ref={ref}
        value={textValue}
        onChange={handleChange}
        onBlur={handleBlur}
        inputMode={allowDecimal ? 'decimal' : 'numeric'}
        {...props}
      />
    )
  },
)
NumberInput.displayName = 'NumberInput'

export { NumberInput }
