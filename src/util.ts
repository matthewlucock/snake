import { useState, useCallback } from 'preact/hooks'

export const px = (x: number): string => `${x}px`

export const useForceUpdate = (): () => void => {
  const [, _] = useState<any>(undefined)
  return useCallback((): void => _({}), [])
}
