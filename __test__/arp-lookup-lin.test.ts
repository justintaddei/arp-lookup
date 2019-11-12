jest.mock('child_process')

import arp from '../src/index'

describe('On a Linux environment', () => {
  Object.defineProperty(process, 'platform', {
    value: 'linux'
  })
  test('Arp table is parsed', async done => {
    await expect(arp.getTable()).resolves.toEqual([
      { ip: '192.168.0.13', mac: '01:00:5e:7f:ff:fa', type: 'unknown', vendor: ''},
      { ip: '192.168.0.3', mac: 'ff:ff:ff:ff:ff:ff', type: 'unknown', vendor: ''},
      { ip: '192.168.0.2', mac: '01:00:5e:00:00:fb', type: 'unknown', vendor: ''},
      { ip: '192.168.0.7', mac: '01:00:5e:00:00:16', type: 'unknown', vendor: ''},
      { ip: '192.168.0.6', mac: '01:00:5e:00:00:02', type: 'unknown', vendor: ''},
      { ip: '192.168.0.5', mac: '01:00:5e:7f:ff:fa', type: 'unknown', vendor: ''}
    ])
    done()
  })
})
