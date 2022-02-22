jest.mock('child_process')

import arp from '../src/index'

describe('On a Linux environment', () => {
  Object.defineProperty(process, 'platform', {
    value: 'linux',
  })
  test('Arp table is parsed', async () => {
    await expect(arp.getTable()).resolves.toMatchSnapshot()
  })
})
