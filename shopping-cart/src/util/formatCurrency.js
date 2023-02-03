const formatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "EUR"
})

export default function formatCurrency(price) {
  return formatter.format(price)
}
