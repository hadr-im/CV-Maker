const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const SHORT = MONTHS.map((month) => month.slice(0, 3))

/** Matches a month name or any prefix of one from three letters up ("Sept"). */
function monthFromName(name: string) {
  const key = name.toLowerCase().slice(0, 3)
  const index = MONTHS.findIndex((month) => month.toLowerCase().startsWith(key))
  return index >= 0 ? SHORT[index] : null
}

/**
 * Rewrites whatever the user typed into "Mon YYYY", "YYYY" or "Present".
 *
 * The date fields are free text, and ATS guidance singles out slashes and dots
 * as parse risks — "03/2022" is a realistic thing to type and a documented way
 * to have a role's dates misread. So this runs on blur and repairs the input
 * rather than rejecting it.
 *
 * Anything it cannot read confidently is returned untouched: a date it does not
 * understand is still the user's data, and silently dropping it would be worse
 * than leaving it unconventional.
 */
export function normalizeCVDate(input: string): string {
  const value = input.trim().replace(/\s+/g, ' ')
  if (!value) return ''
  if (/^(present|current|now|ongoing)$/i.test(value)) return 'Present'

  // Already just a year.
  const yearOnly = value.match(/^(\d{4})$/)
  if (yearOnly) return yearOnly[1]

  // Two numbers in either order, separated by / - . or a space, with an
  // optional trailing day component: 03/2022, 2022-03, 2022-03-15, 3.2022.
  const numeric = value.match(/^(\d{1,4})[/\-. ](\d{1,4})(?:[/\-. ]\d{1,2})?$/)
  if (numeric) {
    const [, first, second] = numeric
    const year = first.length === 4 ? first : second.length === 4 ? second : null
    const month = Number(first.length === 4 ? second : first)

    if (year && month >= 1 && month <= 12) return `${SHORT[month - 1]} ${year}`
  }

  // "Mar 2022", "March 2022", "Sept. 2022"
  const nameFirst = value.match(/^([A-Za-z]{3,9})\.?,? ?(\d{4})$/)
  if (nameFirst) {
    const month = monthFromName(nameFirst[1])
    if (month) return `${month} ${nameFirst[2]}`
  }

  // "2022 March"
  const yearFirst = value.match(/^(\d{4}) ([A-Za-z]{3,9})\.?$/)
  if (yearFirst) {
    const month = monthFromName(yearFirst[2])
    if (month) return `${month} ${yearFirst[1]}`
  }

  return value
}
