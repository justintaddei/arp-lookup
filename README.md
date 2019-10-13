# arp-lookup

![](https://img.shields.io/travis/justintaddei/arp-lookup.svg?style=flat)
![](https://img.shields.io/github/issues-raw/justintaddei/arp-lookup.svg?style=flat)
![](https://img.shields.io/npm/v/@network-utils/arp-lookup.svg?style=flat)
![](https://img.shields.io/npm/dt/@network-utils/arp-lookup.svg?style=flat)
![](https://img.shields.io/npm/l/@network-utils/arp-lookup.svg?style=flat)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
![](https://img.shields.io/github/languages/top/justintaddei/arp-lookup.svg?colorB=blue&style=flat)
![](https://img.shields.io/badge/status-awesome-red.svg?style=flat)

## Installation

```bash
$ npm install @network-utils/arp-lookup --save
```

## Usage

### Example

```typescript
import arp from '@network-utils/arp-lookup'
// Or
import {toMAC, toIP, ...} from '@network-utils/arp-lookup'

// Retrieve the corresponding IP address for a given MAC address
await arp.toIP('04-A1-51-1B-12-92') // Or '04:a1:51:1b:12:92' (any valid MAC format)
// Result: "192.168.2.47"

// Retrieve the corresponding MAC address for a given IP address
await arp.toMAC('192.168.2.47')
// Result: "04:a1:51:1b:12:92" 👈🏼 All MAC addresses are normalized to this format

arp.isMAC('04-a1:51:1B-12-92') // true
arp.isMAC('not:a:mac') // false

arp.isIP('192.168.2.47') // true
arp.isIP('not.an.ip') // false

await arp.is('dynamic', '192.168.2.47') // true
await arp.is('dynamic', '04:a1:51:1b:12:92') // true
await arp.is('static', '192.168.2.255') // true
await arp.is('static', 'ff:ff:ff:ff:ff:ff') // true
await arp.is('undefined', '0.0.0.0') // true

await arp.getTable()
// Result:
[
    { ip: '192.168.137.255', mac: 'ff:ff:ff:ff:ff:ff', type: 'static', vendor: '' },
    { ip: '224.0.0.22', mac: '01:00:5e:00:00:16', type: 'static', vendor: '' },
    { ip: '224.0.0.251', mac: '01:00:5e:00:00:fb', type: 'static', vendor: '' },
    { ip: '224.0.0.252', mac: '01:00:5e:00:00:fc', type: 'static', vendor: '' },
    { ip: '239.255.255.250', mac: '01:00:5e:7f:ff:fa', type: 'static', vendor: '' },
    { ip: '192.168.2.1', mac: '04:a1:51:1b:12:92', type: 'dynamic', vendor: 'Netgear' },
    { ip: '192.168.2.3', mac: '1a:b1:61:2f:14:72', type: 'dynamic', vendor: '' },
    { ip: '192.168.2.255', mac: 'ff:ff:ff:ff:ff:ff', type: 'static', vendor: '' },
    { ip: '224.0.0.2', mac: '01:00:5e:00:00:02', type: 'static', vendor: '' },
    ...
]
```

---

### `getTable(): Promise<IArpTable>`

Returns a promise containing the parsed output of `$ arp -a`

---

### `toMAC(ip: string): Promise<string | null>`

Returns a promise containing the MAC that relates to `ip` or `null` if a match couldn't be made  
**Throws** an `"Invalid IP"` error if `ip` is not a valid IP address

---

### `toIP(mac: string): Promise<string | null>`

Returns a promise containing the IP that relates to `mac` or `null` if a match couldn't be made  
**Throws** an `"Invalid MAC"` error if `mac` is not a valid MAC address

---

### `is(type: 'static' | 'dynamic' | 'undefined', address: string): Promise<boolean>`

- `address` can be any valid IP or MAC address

Returns a promise containing a boolean which indicates the record for `address` is `type`.  
Pass `type = "undefined"` to determine if a record for `address` exists or not  
**Throws** an `"Invalid address"` error if `address` is not a valid IP or MAC address

---

### `isMAC(mac: string): boolean`

Checks if a MAC address is valid

---

### `isIP(ip: string): boolean`

Checks if an IP address is valid

---

## Testing

```bash
$ git clone https://github.com/justintaddei/arp-lookup.git
$ cd arp-lookup
$ npm install
$ npm test
```

## License

MIT
