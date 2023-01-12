export interface CalendarDate {
  id: number
  service_id: string
  date: number
  exception_type: number
  holiday_name?: any
}

export interface CalendarDates {
  calendarDates: CalendarDate[]
}

export function numberToDate(date: number): string {
  if (date) {
    return date.toString().replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
  }
  return ""
}

export function dateToNumber(date: string): number {
  return parseInt(date.replaceAll("-", ""))
}
