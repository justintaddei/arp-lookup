jest.mock('child_process')

import arp from '../src/index'

describe('On a Mac environment', () => {
  Object.defineProperty(process, 'platform', {
    value: 'darwin',
  })
  test('Arp table is parsed', async () => {
    await expect(arp.getTable()).resolves.toMatchSnapshot()
  })
})
