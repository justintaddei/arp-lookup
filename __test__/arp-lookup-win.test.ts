jest.mock('child_process')

import arp from '../src/index'

describe('On a Windows environment', () => {
  Object.defineProperty(process, 'platform', {
    value: 'win32',
  })
  test('Arp table is parsed', async () => {
    await expect(arp.getTable()).resolves.toMatchSnapshot()
  })
})
