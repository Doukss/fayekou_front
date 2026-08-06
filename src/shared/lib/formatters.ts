const currencyFormatter = new Intl.NumberFormat('fr-SN')

export function formatCfa(amount: number): string {
  return `${currencyFormatter.format(amount)} F`
}
