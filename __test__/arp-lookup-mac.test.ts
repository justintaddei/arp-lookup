jest.mock('child_process')

import arp from '../src/index'

describe('On a Mac environment', () => {
  Object.defineProperty(process, 'platform', {
    value: 'darwin'
  })
  test('Arp table is parsed', async () => {
    await expect(arp.getTable()).resolves.toEqual([
      { ip: '192.168.137.255', mac: 'ff:ff:ff:ff:ff:ff', type: 'unknown', vendor: '' },
      { ip: '224.0.0.22', mac: '01:00:5e:00:00:16', type: 'unknown', vendor: '' },
      { ip: '224.0.0.251', mac: '01:00:5e:00:00:fb', type: 'unknown', vendor: '' },
      { ip: '224.0.0.252', mac: '01:00:5e:00:00:fc', type: 'unknown', vendor: '' },
      { ip: '239.255.255.250', mac: '01:00:5e:7f:ff:fa', type: 'unknown', vendor: '' },
      { ip: '255.255.255.255', mac: 'ff:ff:ff:ff:ff:ff', type: 'unknown', vendor: '' },
      { ip: '192.168.2.1', mac: '04:a1:51:1b:12:92', type: 'unknown', vendor: 'Netgear' },
      { ip: '192.168.2.255', mac: 'ff:ff:ff:ff:ff:ff', type: 'unknown', vendor: '' },
      { ip: '224.0.0.2', mac: '01:00:5e:00:00:02', type: 'unknown', vendor: '' },
      { ip: '224.0.0.22', mac: '01:00:5e:00:00:16', type: 'unknown', vendor: '' },
      { ip: '224.0.0.251', mac: '01:00:5e:00:00:fb', type: 'unknown', vendor: '' },
      { ip: '224.0.0.252', mac: '01:00:5e:00:00:fc', type: 'unknown', vendor: '' },
      { ip: '239.255.255.250', mac: '01:00:5e:7f:ff:fa', type: 'unknown', vendor: '' },
      { ip: '255.255.255.255', mac: 'ff:ff:ff:ff:ff:ff', type: 'unknown', vendor: '' }
    ])
  })
})
