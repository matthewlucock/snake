export const shuffleArray = <T>(originalArray: readonly T[]): T[] => {
  const copy = originalArray.slice()
  const newArray = []

  while (copy.length > 0) {
    const index = Math.floor(Math.random() * copy.length)
    newArray.push(...copy.splice(index, 1))
  }

  return newArray
}
