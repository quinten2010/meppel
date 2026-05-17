import { format, formatDistanceToNow, isToday, isTomorrow, isThisWeek, parseISO } from 'date-fns'
import { nl } from 'date-fns/locale'

export function formatDate(date: string | Date, pattern: string = 'd MMM yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, pattern, { locale: nl })
}

export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'HH:mm')
}

export function formatDateRelative(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (isToday(d)) return `Today at ${formatTime(d)}`
  if (isTomorrow(d)) return `Tomorrow at ${formatTime(d)}`
  if (isThisWeek(d)) return format(d, 'EEEE HH:mm', { locale: nl })
  return formatDate(d)
}

export function formatTimeAgo(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(d, { addSuffix: true, locale: nl })
}

export function formatPrice(level: number): string {
  return '€'.repeat(level)
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function formatPriceAmount(amount: number | null, currency: string = 'EUR'): string {
  if (amount === null) return 'Free'
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency }).format(amount)
}

export function formatDay(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'EEE', { locale: nl })
}

export function formatDayNumber(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'd')
}

export function formatMonth(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'MMM', { locale: nl }).toUpperCase()
}
