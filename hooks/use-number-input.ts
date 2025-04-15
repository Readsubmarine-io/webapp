import { useState } from 'react'

export const useNumberInput = (initialValue: number | undefined) => {
  const [value, setValue] = useState(initialValue || 0)
  const [inputValue, setInputValue] = useState(initialValue?.toString() || '0')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newStringValue = e.target.value

    if (!newStringValue) {
      setInputValue('0')
      setValue(0)
      return
    }

    const newValue = Number.parseFloat(newStringValue)

    if (isNaN(newValue)) {
      if (newStringValue.endsWith('.')) {
        newStringValue = newStringValue.replace('.', ',')
        setInputValue(newStringValue)
        return
      }

      return
    }

    setInputValue(newValue.toString())
    setValue(newValue)
  }

  return { value, inputValue, handleChange }
}
