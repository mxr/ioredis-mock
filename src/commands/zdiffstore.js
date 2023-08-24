import { convertStringToBuffer } from '../commands-utils/convertStringToBuffer'
import { del } from './del'
import { zadd } from './zadd'
import { zdiff } from './zdiff'

export function zdiffstore(...vals) {
  if (vals.length < 3) {
    throw new Error("ERR wrong number of arguments for 'zdiffstore' command")
  }

  const [destination, numkeys, ...keys] = vals

  // zdiffstore overwrites the contents of the key
  // so make sure that the zdiff succeeds before purging any existing key
  const newMembersWithScores = zdiff.apply(this, numkeys, ...keys, 'WITHSCORES')

  del.apply(this, destination)
  return zadd.apply(this, destination, ...newMembersWithScores)
}

export function zdiffstoreBuffer(...vals) {
  const val = zdiffstore.apply(this, vals)
  return convertStringToBuffer(val)
}
