import { exec } from 'child_process'
import { isIP } from 'net'
import jsonVendors from './vendors.json' // from https://macaddress.io/database-download/json

export interface IArpTableRow {
  ip: string
  mac: string
  type: 'static' | 'dynamic' | 'unknown'
  vendor: string
}

export type IArpTable = IArpTableRow[]

/*

$ arp -a

Interface: 192.168.137.1 --- 0x2
  Internet Address      Physical Address      Type      Vendor
  192.168.137.255       ff-ff-ff-ff-ff-ff     static
  224.0.0.22            01-00-5e-00-00-16     static
  224.0.0.251           01-00-5e-00-00-fb     static
  224.0.0.252           01-00-5e-00-00-fc     static
  239.255.255.250       01-00-5e-7f-ff-fa     static
  255.255.255.255       ff-ff-ff-ff-ff-ff     static

Interface: 192.168.2.2 --- 0x9
  Internet Address      Physical Address      Type      Vendor
  192.168.2.1           04-a1-51-1b-12-92     dynamic
  192.168.2.255         ff-ff-ff-ff-ff-ff     static
  224.0.0.2             01-00-5e-00-00-02     static
  224.0.0.22            01-00-5e-00-00-16     static
  224.0.0.251           01-00-5e-00-00-fb     static
  224.0.0.252           01-00-5e-00-00-fc     static
  239.255.255.250       01-00-5e-7f-ff-fa     static
  255.255.255.255       ff-ff-ff-ff-ff-ff     static

======================================================================

> await getArpTable()

[
  { ip: '192.168.137.255', mac: 'ff-ff-ff-ff-ff-ff', type: 'static', vendor: '' },
  { ip: '224.0.0.22', mac: '01-00-5e-00-00-16', type: 'static', vendor: '' },
  { ip: '224.0.0.251', mac: '01-00-5e-00-00-fb', type: 'static', vendor: '' },
  { ip: '224.0.0.252', mac: '01-00-5e-00-00-fc', type: 'static', vendor: '' },
  { ip: '239.255.255.250', mac: '01-00-5e-7f-ff-fa', type: 'static', vendor: '' },
  { ip: '255.255.255.255', mac: 'ff-ff-ff-ff-ff-ff', type: 'static', vendor: '' },
  { ip: '192.168.2.1', mac: '04-a1-51-1b-12-92', type: 'dynamic', vendor: '' },
  { ip: '192.168.2.255', mac: 'ff-ff-ff-ff-ff-ff', type: 'static', vendor: '' },
  { ip: '224.0.0.2', mac: '01-00-5e-00-00-02', type: 'static', vendor: '' },
  { ip: '224.0.0.22', mac: '01-00-5e-00-00-16', type: 'static', vendor: '' },
  { ip: '224.0.0.251', mac: '01-00-5e-00-00-fb', type: 'static', vendor: '' },
  { ip: '224.0.0.252', mac: '01-00-5e-00-00-fc', type: 'static', vendor: '' },
  { ip: '239.255.255.250', mac: '01-00-5e-7f-ff-fa', type: 'static', vendor: '' },
  { ip: '255.255.255.255', mac: 'ff-ff-ff-ff-ff-ff', type: 'static', vendor: '' }
]

*/

/**
 * Normalizes a MAC address so that `-` is
 * replaced `:` and is converted to lower case
 *
 * Example: `04-A1-51-1B-12-92` => `04:a1:51:1b:12:92`
 * @param mac The MAC Address to normalize
 */
function normalize(mac: string): string {
  return mac.replace(/\-/g, ':').toLowerCase()
}

/**
 * Fixes the non compliant MAC addresses returned on Apple systems by adding a leading 0 on parts of the address
 * @param mac The MAC address to FIX
 */
function fixMAC(mac: string): string {
  return normalize(mac)
    .split(':')
    .map((part) => (part.length === 1 ? '0' + part : part))
    .join(':')
}

/**
 * Checks if a MAC address is valid
 * @param mac The MAC address to validate
 */
export function isMAC(mac: string): boolean {
  return /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/i.test(mac)
}

/**
 * Checks if a MAC address prefix is valid
 * @param prefix The prefix to validate
 */
export function isPrefix(prefix: string): boolean {
  return /^([0-9A-F]{2}[:-]){2}([0-9A-F]{2})$/i.test(prefix)
}

/**
 * Retrieves the networks' arp table
 */
export function getTable(): Promise<IArpTable> {
  return new Promise((resolve, reject) => {
    // Get the Address Resolution Protocol cache
    exec('arp -a', (err, rawArpData) => {
      if (err) {
        // If there was an error then simply reject
        reject(err)
        return
      }

      /*
        Split the table into rows

        Expected output:

        Interface: 192.168.137.1 --- 0x2
            Internet Address      Physical Address      Type      Vendor
            192.168.1.255         ff-ff-ff-ff-ff-ff     static
            192.168.2.1           04-a1-51-1b-12-92     dynamic
            224.0.0.22            01-00-5e-00-00-16     static
      */
      const rows = rawArpData.split('\n')

      /**
       * The arp table
       */
      const table: IArpTable = []

      // Loop over each row
      for (const row of rows) {
        let ip: string
        let mac: string
        let type: IArpTableRow['type']

        if (process.platform.substring(0, 3) === 'win') {
          // Parse the rows as they are returned on Windows systems
          // Trim the white space from the row and collapse double spaces then
          // split the row into columns of ip, mac, type
          ;[ip, mac, type] = row.trim().replace(/\s+/g, ' ').split(' ') as [string, string, IArpTableRow['type']]
        } else {
          // Parse the rows as they are returned on unix (Mac or Linux) systems
          const match = /.*\((.*?)\) (\w+) (.{0,17}) (?:\[ether\]|on)/g.exec(row)
          if (match && match.length === 4) {
            ip = match[1]
            mac = fixMAC(match[3])
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

        const nomalizedMac = normalize(mac)

        const vendor = jsonVendors.find(({ id }) => nomalizedMac.startsWith(id.toLowerCase()))

        // Add this row to the table
        table.push({
          ip,
          mac: nomalizedMac,
          type,
          vendor: vendor ? vendor.cn : '',
        })
      }

      // Resolve with the populated arp table
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

  // Get the arp table
  const arpTable = await getTable()
  // Try to find a match in the table
  const match = arpTable.find((row) => row.ip === ip)
  // If no match was found then return null
  if (!match) return null
  // Otherwise return with the mac
  return match.mac
}

/**
 * Gets the IP address for given `mac` address
 * @param mac The MAC address
 */
export async function toIP(mac: string): Promise<string | null> {
  if (!isMAC(mac)) throw Error('Invalid MAC')

  mac = normalize(mac)

  // Get the arp table
  const arpTable = await getTable()

  // Try to find a match in the table
  const match = arpTable.find((row) => row.mac === mac)
  // If no match was found then return null
  if (!match) return null
  // Otherwise return with the ip
  return match.ip
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

export async function is(type: IArpTableRow['type'] | 'undefined', address: string): Promise<boolean> {
  if (!isIP(address) && !isMAC(address)) throw Error('Invalid address')
  if (process.platform === 'darwin' && ['static', 'dynamic'].includes(type)) {
    throw Error('Function not available on Mac architecture')
  }

  if (isMAC(address)) address = normalize(address)

  const arpTable = await getTable()

  let actualType: IArpTableRow['type'] | 'undefined' = 'undefined'

  for (const row of arpTable) {
    if (row.ip === address || row.mac === address) {
      actualType = row.type
      break
    }
  }

  return actualType === type
}

export default {
  fromPrefix,
  getTable,
  is,
  isIP,
  isMAC,
  isPrefix,
  toIP,
  toMAC,
}
