Vysk Zabbix Dashboard
============

Lightweight dashboard for Zabbix network services monitoring based on Vue.js.

![Zabbix dashboard](https://user-images.githubusercontent.com/9514732/32372013-73e1db3a-c0d6-11e7-96d0-4b6e8cb4a681.png)

In order to provide at-a-glance network services health monitoring, I put together a front-end dashboard based roughly on Andrew Letson's [zabbixweb](https://github.com/velinath/zabbixweb) Zabbix API library. The dashboard provides a cleaner, semi-customizable interface that Zabbix lacks, and provides near-realtime monitoring intended for use on a view-only kiosk (such as FullPageOS for Raspberry Pi).

The app is broken into the following components:
- `/js/zabbix.js`: A Zabbix API library (unmodified from Andrew), which handles basic authentication and API call duties to the Zabbix server
- `/js/app.js`: This dashboard app, which primarily parses Zabbix API's (somewhat overcomplicated) JSON data into a simpler JSON object suitable for use with Vue.js
- `/js/config.js`: A simple JSON object containing the host and item information to be displayed on the dashboard (see below)
- `/index.html`: A static HTML page containing template and layout data and logic

Most of the work behind this dashboard app is put into maintaining a clean separation of concerns between the bulk raw API data (Zabbix API and `/js/app.js`), host configuration (`/js/config.js`), and display (`index.html`).

Layout and styles from precompiled Bootstrap/Font Awesome.

---

### Requirements

- Zabbix installation with API and guest access enabled
- Basic HTTP service (Apache, nginx) that can serve `index.html`, can be the same service that serves Zabbix

Zabbix should be configured separately according to Zabbix documentation. As a guide, the process is roughly:
1. Install a Zabbix agent on a host that you want to monitor
2. Adjust firewall rules to allow Zabbix agent to communicate
3. Add the host Zabbix
4. Import an existing template or enable auto-discovery to populate host items, or manually define host items

From there, host item data will be included in the API request payload.

Ubiquiti UniFi AP shown in this example requires a separate proxy middleware to feed AP data into Zabbix, requiring separate installation and host item key definition. Refer to [UniFi Proxy](https://github.com/zbx-sadman/unifi_proxy/wiki/UniFi-Proxy-Guide-in-English) and [Uniquiti UniFi + zabbix discussion](https://www.zabbix.com/forum/showthread.php?t=44717) for further information.

Support for printer status monitoring (toner level, printed page count, tray status) is provided by SNMP reporting. You will need to refer to your printer's SNMP documentation to identify the correct SNMP OIDs, then add them to a Zabbix host as a manually-defined item. As each printer manufacturer has different SNMP OID values/units/codes, some trial and error may be necessary. Additional SNMP authentication and corresponding firewall configuration may be necessary.

---

### Application Basics

When fetching data from the Zabbix API, the returned JSON payload is extremely granular, generally unit-less, and not dashboard-friendly. In order to support a broad range of monitoring capabilities, Zabbix treats monitoring data as raw data, and does not distinguish between data types (such as booleans or decimals) or display formats (such as progress bars, percentages, or status icons). Zabbix provides rudimentary ways for data to be consumed, such as assigning human-readable labels to response/error codes on a per-item basis. But configuration is cumbersome, and Zabbix's built-in dashboards are still primarily text-based.

`/js/app.js` takes care of parsing the dense Zabbix API JSON object and populating a local variable `data` with the appropriate hosts and item data. The `parseData` method extracts only the data specified in `/js/config.js` to ensure low resource usage client-side, and formats each host's items (CPU, memory/disk usage, etc) into appropriate formats (decimals, percentages, booleans) for handling.

All parsed host data is stored in a client-side `data` object.

Supported host item taxonomy (object "types"):
- `cpu`: CPU usage, _percentage_
- `proc`: process count, _integer_
- `uptime`: host uptime, _seconds_
- `ping`: host response time, _milliseconds_
- `vm`: memory usage, _object_ containing
  - `used`: memory usage, _bytes_
  - `total`: total memory, _bytes_
- `vfs`: disk usage, _array_ of objects, each object containing
  - `used`: disk used space, _bytes_
  - `free`: disk free space, _bytes_
  - `total`: total disk size, _bytes_
- `if`: network traffic, _array_ of objects, each object containng
  - `in`: network traffic in, _bits_
  - `out`: network traffic out, _bits_
- `services`: service status, _array_ of strings, each string containing "OK" or "ERROR" as the boolean status of the service
- `toner`: printer toner level, _array_ of objects, each object containng
  - `current`: current toner level, _integer_
  - `total`: toner total level, _integer_
- `pagecount`: printer page count, _array_ of integers, each integer containing the reported page count

Basic Ubiquiti UniFi AP monitoring is also supported with this taxonomy:
- `users`: number of users connected to AP, _integer_
- `in`: network traffic in, _bits_
- `out`: network traffic out, _bits_

Since Zabbix has built-in graph rendering, the Ubiquiti UniFi AP traffic graphs shown above are handled by simply defining the URL that points to the corresponding Zabbix graph. An arbitrary query string (timestamp) is appended to the URL to ensure the browser does not use a cached image.

Unit conversion is done inside `index.html` so that no additional logic is required inside `/js/app.js` or `/js/config.js`.

---

### Configuration

Dashboard configuration is kept separate in `/js/config.js` and contains an object `hosts` that tells the dashboard app what data to retrieve for each defined host.

```
'MONITOR': {
  label: 'MONITOR',
  icon: 'server',
  cpu: 'system.cpu.load[percpu,avg1]',
  proc: 'proc.num[]',
  vm: {
    used: 'vm.memory.size[used]',
    total: 'vm.memory.size[total]'
  },
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
    'SSH':    { key: 'net.tcp.port[,22]',   ok: '1' },
    'APACHE': { key: 'net.tcp.port[,80]',   ok: '1' },
    'MYSQL':  { key: 'net.tcp.port[,3306]', ok: '1' }
  }
},

```

As you can see, the format follows the `data` object taxonomy. The values for each key correspond to the host item _key_ defined in Zabbix. Since Zabbix API will dump all of the raw data indexed for each host by this key, there is no consistency in how "Disk Usage" (for instance) is defined across different systems (Windows, Linux, etc). The key-values in `/js/config.js` lets you manually identify the appropriate Zabbix item key that corresponds to the monitored item. This also allows you to arbitrarily define arrays of monitored items, such as multiple disks or services, which may vary between hosts with different hardware configurations.

In addition, the `services` sub-object includes an `ok` sub-key, which defines the expected value that corresponds with an "OK/No Error" status. This allows you to set the correct corresponding response code for each service (for example, `ok: '1'` may mean "Running" for one service, while meaning "Error" for another service).

---

### Data Binding

One-way data-binding is handled automatically with Vue and populated in templating code in `index.html`. `/js/app.js` polls the Zabbix API at a defined interval, parses the JSON response, and updates the client-side `data` object. The `data` object is passed into the Vue app initialization, so any updates to `data` will cause Vue to update the dashboard.

Note: In this instance, `/js/app.js` is set to fetch from the Zabbix API every 10 seconds. However, individual host items may be configured in Zabbix to update at slower intervals (30 seconds, 1 minute, etc) and therefore will not appear to update on the dashboard until the next Zabbix-defined interval.

---

### Running

As the app requires actual Zabbix API data to parse, no demo is available directly from this repo. However, assuming a working Zabbix instance meeting the requirements is accessible, `/js/config.js` should be easy to modify to adapt to different Zabbix installations.
