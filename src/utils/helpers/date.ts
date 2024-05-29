export const getTime = (date: string) => {
  const newDate = new Date(date)

  const hour = newDate.getHours().toString().padStart(2, '0')
  const minute = newDate.getMinutes().toString().padStart(2, '0')

  return `${hour}:${minute}`
}

export const getDate = (date: string) => {
  const newDate = new Date(date)

  const year = newDate.getFullYear().toString().padStart(4, '0')
  const month = (newDate.getMonth() + 1).toString().padStart(2, '0')
  const day = newDate.getDate().toString().padStart(2, '0')

  return `${day}.${month}.${year}`
}

export const getDateTime = (date: string) => {
  const newDate = getDate(date)
  const newTime = getTime(date)

  return `${newDate} ${newTime}`
}

export const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.round(totalSeconds % 60)

  const formattedHours = String(hours).padStart(2, '0')
  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(seconds).padStart(2, '0')

  return `${hours ? `${formattedHours}:` : ''}${formattedMinutes}:${formattedSeconds}`
}
