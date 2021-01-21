export const trunc = (num, place = 2) => {
  return Math.trunc(num * Math.pow(10, place)) / Math.pow(10, place)
}