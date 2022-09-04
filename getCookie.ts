export function getCookie(cookieHeader: string | undefined, cookieKey: string) {
  const headerString = `; ${cookieHeader}`
  const keyVal = headerString.split(`; ${cookieKey}=`)
  if (keyVal.length === 2) {
    return keyVal.pop()?.split(';').shift()
  }
}
