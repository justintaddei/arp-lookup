jest.mock('child_process')

import arp from '../src/index'

test('Arp table is parsed', async done => {
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
  done()
})

describe('Arp conversions', () => {
  test('Convert from ip to mac', async done => {
    const mac = await arp.toMAC('192.168.2.1')
    expect(mac).toBe('04:a1:51:1b:12:92')
    done()
  })
  test('Convert from mac to ip', async done => {
    const ip = await arp.toIP('04:a1:51:1b:12:92')
    expect(ip).toBe('192.168.2.1')
    done()
  })
  describe('arp.is()', () => {
    test('static mac', async done => {
      await expect(arp.is('static', '01:00:5e:00:00:02')).resolves.toBe(true)
      done()
    })
    test('static ip', async done => {
      await expect(arp.is('static', '192.168.2.255')).resolves.toBe(true)
      done()
    })
    test('dynamic mac', async done => {
      await expect(arp.is('dynamic', '04:a1:51:1b:12:92')).resolves.toBe(true)
      done()
    })
    test('dynamic ip', async done => {
      await expect(arp.is('dynamic', '192.168.2.1')).resolves.toBe(true)
      done()
    })
    test('undefined address', async done => {
      await expect(arp.is('undefined', '0.0.0.0')).resolves.toBe(true)
      done()
    })
  })
})

describe('Validation works properly', () => {
  describe('MAC addresses', () => {
    test('Throw on invalid mac', async done => {
      await expect(arp.toIP('not:a:mac')).rejects.toThrowError('Invalid MAC')
      done()
    })
    test('is() throws on invalid mac', async done => {
      await expect(arp.is('undefined', 'not:a:mac')).rejects.toThrowError('Invalid address')
      done()
    })
  })
  describe('IP addresses', () => {
    test('Throw on invalid ip', async done => {
      await expect(arp.toMAC('not.an.ip')).rejects.toThrowError('Invalid IP')
      done()
    })
    test('is() throws on invalid ip', async done => {
      await expect(arp.is('undefined', 'not.an.ip')).rejects.toThrowError('Invalid address')
      done()
    })
  })
})
