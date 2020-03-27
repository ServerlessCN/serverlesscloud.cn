/**
 * 2019-10-14T00:00:00.000Z -> AUG 07 2019
 * @param {
 * } dateString
 */
export function formateDate(dateString, zero: boolean = false, delimiter: string = '-') {
  try {
    const date = new Date(dateString)
    const year = date.getFullYear()
    let month: any = date.getMonth() + 1
    let day: any = date.getDate()
    if (zero) {
      if (month < 10) month = '0' + month
      if (day < 10) day = '0' + day
    }
    return `${year}${delimiter}${month}${delimiter}${day}`
  } catch (err) {
    return dateString
  }
}

export function debounce(func, wait = 50) {
  let timer = 0
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}
