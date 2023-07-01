import { exec } from 'child_process'
import { isIP } from 'net'
export interface IArpTableRow {
  ip: string
  mac: string
  type: 'static' | 'dynamic' | 'unknown'
}

export type IArpTable = IArpTableRow[]

/**
 * Normalizes a MAC address so that `-` is
 * replaced `:` and is converted to lower case
 *
 * Example: `04-A1-51-1B-12-92` => `04:a1:51:1b:12:92`
 * @param mac The MAC Address to normalize
 */
const normalize = (mac: string): string => mac.replace(/\-/g, ':').toLowerCase()

/**
 * Fixes the non compliant MAC addresses returned on Apple systems by adding a leading 0 on parts of the address
 * @param mac The MAC address to FIX
 */
const fixMAC = (mac: string): string =>
  normalize(mac)
    .split(':')
    .map((part) => (part.length === 1 ? '0' + part : part))
    .join(':')

/**
 * Checks if a MAC address is valid
 * @param mac The MAC address to validate
 */
export const isMAC = (mac: string): boolean => /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/i.test(mac)

/**
 * Checks if a MAC address prefix is valid
 * @param prefix The prefix to validate
 */
export const isPrefix = (prefix: string): boolean => /^([0-9A-F]{2}[:-]){2}([0-9A-F]{2})$/i.test(prefix)

/**
 * Retrieves the networks' arp table
 */
export function getTable(): Promise<IArpTable> {
  return new Promise((resolve, reject) => {
    exec('arp -a', (err, rawArpData) => {
      if (err) {
        reject(err)
        return
      }

      const rows = rawArpData.split('\n')

      const table: IArpTable = []

      for (const row of rows) {
        let ip: string
        let mac: string
        let type: IArpTableRow['type']

        if (process.platform.substring(0, 3) === 'win') {
          ;[ip, mac, type] = row.trim().replace(/\s+/g, ' ').split(' ') as [string, string, IArpTableRow['type']]
        } else {
          // Parse the rows as they are returned on unix (Mac or Linux) systems
          const match = /.*\((.*?)\) (?:\w+) (.{0,17}) (?:\[ether\]|on)/g.exec(row)
          if (match && match.length === 3) {
            ip = match[1]
            mac = fixMAC(match[2])
            type = 'unknown'
          } else {
            continue
          }
        }

        /*
          If `ip` isn't a valid IP address or `mac` isn't
          a valid MAC address then this is a header
          row (e.g. "Interface: 192.168.137.1 --- 0x2")
          so we can just ignore it.
        */
        if (!isIP(ip) || !isMAC(mac)) continue

        table.push({
          ip,
          mac: normalize(mac),
          type,
        })
      }

      resolve(table)
    })
  })
}

/**
 * Gets the MAC address for the given `ip` address
 * @param ip The IP address
 */
export async function toMAC(ip: string): Promise<string | null> {
  if (!isIP(ip)) throw Error('Invalid IP')

  const arpTable = await getTable()
  const match = arpTable.find((row) => row.ip === ip)

  return match ? match.mac : null
}

/**
 * Gets the IP address for given `mac` address
 * @param mac The MAC address
 */
export async function toIP(mac: string): Promise<string | null> {
  if (!isMAC(mac)) throw Error('Invalid MAC')

  mac = normalize(mac)

  const arpTable = await getTable()

  const match = arpTable.find((row) => row.mac === mac)

  return match ? match.ip : null
}

/**
 * Returns all devices on the network with
 * the specified MAC prefix
 * @param prefix the prefix to search for
 */
export async function fromPrefix(prefix: string): Promise<IArpTableRow[]> {
  if (!isPrefix(prefix)) throw Error('Invalid Prefix')

  const table = await getTable()

  return table.filter((row) => row.mac.startsWith(prefix))
}

export async function isType(type: IArpTableRow['type'] | 'undefined', address: string): Promise<boolean> {
  return type === await getType(address)
}

export async function getType(address: string): Promise<string> {
  if (!isIP(address) && !isMAC(address)) throw Error('Invalid address')

  if (process.platform === 'darwin' && process.env.NODE_ENV !== 'production')
    console.warn('[arp-lookup] `isType` will always return `false` for types other than "unknown" on darwin systems')

  if (isMAC(address)) address = normalize(address)

  const recordedType = (await getTable()).find((row) => row.ip === address || row.mac === address)?.type ?? 'undefined'

  return recordedType
}

export default {
  fromPrefix,
  getTable,
  getType,
  isType,
  isIP,
  isMAC,
  isPrefix,
  toIP,
  toMAC,
}
