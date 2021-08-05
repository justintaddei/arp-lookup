jest.mock('child_process')

import arp from '../src/index'

describe('On a Windows environment', () => {
  Object.defineProperty(process, 'platform', {
    value: 'win32'
  })
  test('Arp table is parsed', async () => {
    await expect(arp.getTable()).resolves.toEqual([
      { ip: '192.168.137.255', mac: 'ff:ff:ff:ff:ff:ff', type: 'static', vendor: '' },
      { ip: '224.0.0.22', mac: '01:00:5e:00:00:16', type: 'static', vendor: '' },
      { ip: '224.0.0.251', mac: '01:00:5e:00:00:fb', type: 'static', vendor: '' },
      { ip: '224.0.0.252', mac: '01:00:5e:00:00:fc', type: 'static', vendor: '' },
      { ip: '239.255.255.250', mac: '01:00:5e:7f:ff:fa', type: 'static', vendor: '' },
      { ip: '255.255.255.255', mac: 'ff:ff:ff:ff:ff:ff', type: 'static', vendor: '' },
      { ip: '192.168.2.1', mac: '04:a1:51:1b:12:92', type: 'dynamic', vendor: 'Netgear' },
      { ip: '192.168.2.255', mac: 'ff:ff:ff:ff:ff:ff', type: 'static', vendor: '' },
      { ip: '224.0.0.2', mac: '01:00:5e:00:00:02', type: 'static', vendor: '' },
      { ip: '224.0.0.22', mac: '01:00:5e:00:00:16', type: 'static', vendor: '' },
      { ip: '224.0.0.251', mac: '01:00:5e:00:00:fb', type: 'static', vendor: '' },
      { ip: '224.0.0.252', mac: '01:00:5e:00:00:fc', type: 'static', vendor: '' },
      { ip: '239.255.255.250', mac: '01:00:5e:7f:ff:fa', type: 'static', vendor: '' },
      { ip: '255.255.255.255', mac: 'ff:ff:ff:ff:ff:ff', type: 'static', vendor: '' }
    ])
  })
})
