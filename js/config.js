var config = {
  timestamp: new Date().getTime(),
  api: {
    url: 'http://monitor.vyskcomm.local/api_jsonrpc.php',
    user: 'guest',
    pass: '',
    version: '3.0.2'
  },
  hosts: {
    /*-----------------------------------------------------------------------*/
    'MONITOR': {
      label: 'MONITOR',
      icon: 'server',
      cpu: 'system.cpu.load[percpu,avg1]',
      proc: 'proc.num[]',
      vm: { used: 'vm.memory.size[used]', total: 'vm.memory.size[total]' },
      vfs: {
        'DISK': {
          used: 'vfs.fs.size[/,used]',
          free: 'vfs.fs.size[/,free]',
          total: 'vfs.fs.size[/,total]'
        }
      },
      uptime: 'system.uptime',
      ping: 'agent.ping',
      if: {
        'ETH0': {
          in: 'net.if.in[p6p1]',
          out: 'net.if.out[p6p1]'
        }
      },
      services: {
        'SSH':         { key: 'net.tcp.port[,22]',                       ok: '1' },
        'APACHE':      { key: 'net.tcp.port[,80]',                       ok: '1' },
        'MYSQL':       { key: 'net.tcp.port[,3306]',                     ok: '1' },
        'UNIFI PROXY': { key: 'net.tcp.port[,8448]',                     ok: '1' },
        'ASSETS':      { key: 'net.tcp.port[assets.vyskcomm.local,80]',  ok: '1' },
        'WIKI':        { key: 'net.tcp.port[wiki.vyskcomm.local,80]',    ok: '1' },
        'ZABBIX':      { key: 'net.tcp.port[monitor.vyskcomm.local,80]', ok: '1' }
      }
    },
    /*-----------------------------------------------------------------------*/
    'VYSKERP': {
      label: 'ERP',
      icon: 'server',
      cpu: 'system.cpu.load[percpu,avg1]',
      proc: 'proc.num[]',
      vm: { used: 'vm.memory.size[used]', total: 'vm.memory.size[total]'},
      vfs: {
        'C': {
          used: 'vfs.fs.size[C:,used]',
          free: 'vfs.fs.size[C:,free]',
          total: 'vfs.fs.size[C:,total]'
        },
        'E': {
          used: 'vfs.fs.size[E:,used]',
          free: 'vfs.fs.size[E:,free]',
          total: 'vfs.fs.size[E:,total]'
        }
      },
      uptime: 'system.uptime',
      ping: 'agent.ping',
      if: {
       'ETH1': {
          in: 'net.if.in[Intel(R) 82579LM Gigabit Network Connection]',
          out: 'net.if.out[Intel(R) 82579LM Gigabit Network Connection]'
        }
      },
      services: {
        'DNS':        { key: 'service.info[DNS]',                                     ok: '0' },
        'AD CS':      { key: 'service.info[CertSvc]',                                 ok: '0' },
        'AD DS':      { key: 'service.info[NTDS]',                                    ok: '0' },
        'RDS':        { key: 'service.info[TermService]',                             ok: '0' },
        'UNIFI':      { key: 'service.info[UniFi]',                                   ok: '0' },
        'SAGE DB':    { key: 'service.info[psqlWGE]',                                 ok: '0' },
        'SW LM':      { key: 'service.info[SolidWorks SolidNetWork License Manager]', ok: '0' },
        'SW PDM AS':  { key: 'service.info[ArchiveServerService]',                    ok: '0' },
        'SW PDM DB':  { key: 'service.info[MSSQL$SWPDM]',                             ok: '0' },
        'SW PDM DBS': { key: 'service.info[ConisioDbServer]',                         ok: '0' }
      }
    },
    /*-----------------------------------------------------------------------*/
    'VYSKGPMR': {
      label: 'GPMR',
      icon: 'server',
      cpu: 'system.cpu.load[percpu,avg1]',
      proc: 'proc.num[]',
      vm: { used: 'vm.memory.size[used]', total: 'vm.memory.size[total]' },
      vfs: {
        'C': {
          used: 'vfs.fs.size[C:,used]',
          free: 'vfs.fs.size[C:,free]',
          total: 'vfs.fs.size[C:,total]'
        }
      },
      uptime: 'system.uptime',
      ping: 'agent.ping',
      if: {
        'ETH0': {
          in: 'net.if.in[Broadcom BCM5716C NetXtreme II GigE (NDIS VBD Client) #28]',
          out: 'net.if.out[Broadcom BCM5716C NetXtreme II GigE (NDIS VBD Client) #28]'
        },
        'ETH1': {
          in: 'net.if.in[Broadcom BCM5716C NetXtreme II GigE (NDIS VBD Client) #27]',
          out: 'net.if.out[Broadcom BCM5716C NetXtreme II GigE (NDIS VBD Client) #27]'
        },
        'VPN': {
          in: 'net.if.in[MsBridge]',
          out: 'net.if.out[MsBridge]'
        }
      },
      services: {
        'OPENVPN': { key: 'service.info[OpenVPNService]', ok: '0'},
        'RDS':     { key: 'service.info[TermService]',    ok: '0'},
        'GPMR DB': { key: 'service.info[MSSQL$GPMRSQL]',  ok: '0'}
      }
    },
    /*-----------------------------------------------------------------------*/
    'VYSKSWDC': {
      label: 'SWDC',
      icon: 'server',
      cpu: 'system.cpu.load[percpu,avg1]',
      proc: 'proc.num[]',
      vm: { used: 'vm.memory.size[used]', total: 'vm.memory.size[total]' },
      vfs: {
        'C': {
          used: 'vfs.fs.size[C:,used]',
          free: 'vfs.fs.size[C:,free]',
          total: 'vfs.fs.size[C:,total]'
        }
      },
      uptime: 'system.uptime',
      ping: 'agent.ping',
      if: {
        'ETH0': {
          in: 'net.if.in[Intel(R) 82579LM Gigabit Network Connection]',
          out: 'net.if.out[Intel(R) 82579LM Gigabit Network Connection]'
        }
      },
      services: {
        'RDS': { key: 'service.info[TermService]', ok: '0' }
      }
    },
    /*-----------------------------------------------------------------------*/
    'GITLAB': {
      label: 'GITLAB',
      icon: 'server',
      cpu: 'system.cpu.load[percpu,avg1]',
      proc: 'proc.num[]',
      vm: { used: 'vm.memory.size[used]', total: 'vm.memory.size[total]' },
      vfs: {
        'DISK': {
          used: 'vfs.fs.size[/,used]',
          free: 'vfs.fs.size[/,free]',
          total: 'vfs.fs.size[/,total]'
        }
      },
      uptime: 'system.uptime',
      ping: 'agent.ping',
      if: {
        'ETH0': {
          in: 'net.if.in[eth0]',
          out: 'net.if.out[eth0]'
        },
        'VPN': {
          in: 'net.if.in[tun0]',
          out: 'net.if.out[tun0]'
        }
      },
      services: {
        'GITLAB':      { key: 'net.tcp.port[,80]',                       ok: '1' },
        'OPENVPN':     { key: 'net.udp.listen[1194]',                    ok: '1' }
      }
    },
    'LEXMARK': {
      label: 'LEXMARK',
      icon: 'print',
      ping: 'icmppingsec',
      toner: {
        'CYAN':     { current: 'toner.cyan.current',    total: 'toner.cyan.max'     },
        'MAGENTA':  { current: 'toner.magenta.current', total: 'toner.magenta.max'  },
        'YELLOW':   { current: 'toner.yellow.current',  total: 'toner.yellow.max'   },
        'BLACK':    { current: 'toner.black.current',   total: 'toner.black.max'    }
      },
      pagecount: {
        'COLOR': 'count.color',
        'MONO': 'count.mono'
      },
      services: {
        'TRAY 1': { key: 'tray.1.status', ok: '4' },
        'TRAY 2': { key: 'tray.2.status', ok: '4' },
        'TRAY 3': { key: 'tray.3.status', ok: '4' }
      }
    }
  },
  /*-------------------------------------------------------------------------*/
  unifi: {
    'UAP SR': {
      users: 'unifi.proxy[get,uap,default,num_sta,56b210eca47a66e4c89e4e4c]',
      in:    'unifi.proxy[get,uap,default,uplink.rx_bytes-r,56b210eca47a66e4c89e4e4c]',
      out:   'unifi.proxy[get,uap,default,uplink.tx_bytes-r,56b210eca47a66e4c89e4e4c]',
      graph: 'http://monitor.vyskcomm.local/chart2.php?graphid=625&width=304&height=100'
    },
    'UAP EL': {
      users: 'unifi.proxy[get,uap,default,num_sta,56b10497a47ab7a549242792]',
      in:    'unifi.proxy[get,uap,default,uplink.rx_bytes-r,56b10497a47ab7a549242792]',
      out:   'unifi.proxy[get,uap,default,uplink.tx_bytes-r,56b10497a47ab7a549242792]',
      graph: 'http://monitor.vyskcomm.local/chart2.php?graphid=623&width=304&height=100'
    },
    'UAP FB': {
      users: 'unifi.proxy[get,uap,default,num_sta,56b10403a47ab7a549242790]',
      in:    'unifi.proxy[get,uap,default,uplink.rx_bytes-r,56b10403a47ab7a549242790]',
      out:   'unifi.proxy[get,uap,default,uplink.tx_bytes-r,56b10403a47ab7a549242790]',
      graph: 'http://monitor.vyskcomm.local/chart2.php?graphid=624&width=304&height=100'
    },
    'UAP 3F': {
      users: 'unifi.proxy[get,uap,default,num_sta,56b10849a47ab7a5492427f0]',
      in:    'unifi.proxy[get,uap,default,uplink.rx_bytes-r,56b10849a47ab7a5492427f0]',
      out:   'unifi.proxy[get,uap,default,uplink.tx_bytes-r,56b10849a47ab7a5492427f0]',
      graph: 'http://monitor.vyskcomm.local/chart2.php?graphid=626&width=304&height=100'
    }
  }
};
