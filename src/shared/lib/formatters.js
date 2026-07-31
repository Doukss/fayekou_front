const currencyFormatter = new Intl.NumberFormat('fr-SN')

export function formatCfa(amount) {
  return `${currencyFormatter.format(amount)} F`
}
