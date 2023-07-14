const arpTableWin = `Interface: 192.168.137.1 --- 0x2
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
  255.255.255.255       ff-ff-ff-ff-ff-ff     static`

const arpTableMac = `? (192.168.137.255) at ff-ff-ff-ff-ff-ff on en9 ifscope [ethernet]
  ? (224.0.0.22) at 01-00-5e-00-00-16 on en9 ifscope [ethernet]
  ? (224.0.0.251) at 01-00-5e-00-00-fb on en9 ifscope [ethernet]
  ? (224.0.0.252) at 01-00-5e-00-00-fc on en9 ifscope [ethernet]
  ? (239.255.255.250) at 01-00-5e-7f-ff-fa on en9 ifscope [ethernet]
  ? (255.255.255.255) at ff-ff-ff-ff-ff-ff on en9 ifscope [ethernet]
  ? (192.168.2.1) at 04-a1-51-1b-12-92 on en9 ifscope [ethernet]
  ? (192.168.2.255) at ff-ff-ff-ff-ff-ff on en9 ifscope [ethernet]
  ? (224.0.0.2) at 01-00-5e-00-00-02 on en9 ifscope [ethernet]
  ? (224.0.0.22) at 01-00-5e-00-00-16 on en9 ifscope [ethernet]
  ? (224.0.0.251) at 01-00-5e-00-00-fb on en9 ifscope [ethernet]
  ? (224.0.0.252) at 01-00-5e-00-00-fc on en9 ifscope [ethernet]
  ? (239.255.255.250) at 01-00-5e-7f-ff-fa on en9 ifscope [ethernet]
  ? (255.255.255.255) at ff-ff-ff-ff-ff-ff on en9 ifscope [ethernet]`

const arpTableLinux = `? (192.168.0.14) at 1s:21:f3:f1:fe:f2 [ether] on wlan0
? (192.168.0.13) at 01:00:5e:7f:ff:fa [ether] on wlan0
? (192.168.0.3) at ff:ff:ff:ff:ff:ff [ether] on wlan0
? (192.168.0.2) at 01:00:5e:00:00:fb [ether] on wlan0
? (192.168.0.7) at 01:00:5e:00:00:16 [ether] on wlan0
? (192.168.0.6) at 01:00:5e:00:00:02 [ether] on wlan0
? (192.168.0.5) at 01:00:5e:7f:ff:fa [ether] on wlan0`

export function exec(cmd: string, cb: (err: Error | undefined, stdout: string) => void) {
  if (cmd !== 'arp -a' && cmd !== 'arp -an') cb(Error('Unknown command'), 'unknown command')

  const platform = process.platform.substring(0, 3);
  if (platform === 'win') {
    cb(undefined, arpTableWin)
  } else if(platform === 'lin') {
    cb(undefined, arpTableLinux)
  } else {
    cb(undefined, arpTableMac)
  }
}
