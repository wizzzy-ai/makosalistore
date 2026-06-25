const NGN_FORMATTER = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 2,
})

export const formatCurrency = (value) => {
  const amount = Number(value)
  if (Number.isNaN(amount)) return '₦0.00'
  return NGN_FORMATTER.format(amount)
}

