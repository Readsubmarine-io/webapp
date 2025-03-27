interface USDPriceDisplayProps {
  amount: number
}

export function USDPriceDisplay({ amount }: USDPriceDisplayProps) {
  return (
    <span className="text-gray-500 ml-1 font-normal text-sm">
      | $
      {amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}{' '}
      |
    </span>
  )
}
