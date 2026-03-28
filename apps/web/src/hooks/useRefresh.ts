import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const refreshAtom = atomWithStorage<number | false>('refresh_time', false)

export function useRefresh() {
  return useAtom(refreshAtom)
}