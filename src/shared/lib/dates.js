import { differenceInCalendarDays, format, isPast, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export function getDueStatus(dueDate, paymentStatus) {
  if (paymentStatus === 'Payé') return { label: 'Payé', tone: 'paid' }
  const date = parseISO(dueDate)
  const overdueDays = differenceInCalendarDays(new Date(), date)
  if (isPast(date) && overdueDays > 0) return { label: `En retard · ${overdueDays} j`, tone: 'late' }
  return { label: `Échéance le ${format(date, 'd MMM', { locale: fr })}`, tone: 'pending' }
}
