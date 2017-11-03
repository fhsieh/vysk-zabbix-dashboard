var zabbix; // global instance of zabbix
var data = {
  hosts: {}, // initialize with empty hosts object
  unifi: {} // initialize with empty graphs object
};

function getData(api, hostname) {
  return api.call('host.get', {
    search:             {'host': hostname},
    selectItems:        ['key_', 'lastvalue', 'units', 'itemid', 'status'],
    selectInventory:    false,
    output:             'extend',
    expandDescription:  1,
    expandData:         1
  });
}

function parseData(response) {
  // parse hosts data
  $.each(config.hosts, function(hostname, items) {
    var hostdata = find(response, 'host', hostname).items;

    $.each(items, function(item) {
      if ($.inArray(item, ['cpu', 'proc', 'uptime', 'ping']) > -1) {
        var value = find(hostdata, 'key_', items[item]);
        data.hosts[hostname][item] = (item == 'cpu') ? parseFloat(value.lastvalue) : parseInt(value.lastvalue);
      } else if (item == 'vm') {
        data.hosts[hostname].vm.used = parseInt(find(hostdata, 'key_', items.vm.used).lastvalue);
        data.hosts[hostname].vm.total = parseInt(find(hostdata, 'key_', items.vm.total).lastvalue);
      } else if (item == 'vfs') {
        $.each(items.vfs, function(k) {
          data.hosts[hostname].vfs[k].used = parseInt(find(hostdata, 'key_', items.vfs[k].used).lastvalue);
          data.hosts[hostname].vfs[k].free = parseInt(find(hostdata, 'key_', items.vfs[k].free).lastvalue);
          data.hosts[hostname].vfs[k].total = parseInt(find(hostdata, 'key_', items.vfs[k].total).lastvalue);
        });
      } else if (item == 'if') {
        $.each(items.if, function(k) {
          data.hosts[hostname].if[k].in = parseInt(find(hostdata, 'key_', items.if[k].in).lastvalue);
          data.hosts[hostname].if[k].out = parseInt(find(hostdata, 'key_', items.if[k].out).lastvalue);
        });
      } else if (item == 'services') {
        $.each(items.services, function(k) {
          var value = find(hostdata, 'key_', items.services[k].key).lastvalue;
          data.hosts[hostname].services[k] = (value === items.services[k].ok) ? 'OK' : 'ERROR';
        });
      } else if (item == 'toner') {
        $.each(items.toner, function(c) {
          data.hosts[hostname].toner[c].current = parseInt(find(hostdata, 'key_', items.toner[c].current).lastvalue);
          data.hosts[hostname].toner[c].total = parseInt(find(hostdata, 'key_', items.toner[c].total).lastvalue);
        });
      } else if (item == 'pagecount') {
        $.each(items.pagecount, function(t) {
          data.hosts[hostname].pagecount[t] = parseInt(find(hostdata, 'key_', items.pagecount[t]).lastvalue);
        })
      }
    });
  });

  var controller = find(response, 'host', 'MONITOR').items;
  $.each(config.unifi, function(uap, items) {
    data.unifi[uap].users = parseInt(find(controller, 'key_', items.users).lastvalue);
    data.unifi[uap].in = parseInt(find(controller, 'key_', items.in).lastvalue);
    data.unifi[uap].out = parseInt(find(controller, 'key_', items.out).lastvalue);
  });
}

function find(array, key, value) {
  return array.filter(function(keys) {
    return keys[key] === value;
  })[0];
}

$(document).ready(function() {

  // initialize zabbix
  zabbix = new $.zabbix(config.api.url, config.api.user, config.api.pass);

  if(zabbix.getApiVersion() > config.version) {
    console.log(zabbix.getApiVersion());
    throw new Error('Zabbix has been updated, check the new documentation then update the code and Zabbix API version');
  }

  // authenticate api call
  zabbix.authenticate();

  // initialize timestamp
  data.timestamp = config.timestamp;

  // populate data.hosts according to config.hosts
  $.each(config.hosts, function(hostname, items) {
    var host = {};

    host.label = items.label;
    host.icon = items.icon;

    $.each(items, function(item) {
      if ($.inArray(item, ['cpu', 'proc', 'uptime', 'ping']) > -1) {
        host[item] = 0;
      } else if (item == 'vm') {
        host.vm = { used: 0, total: 0 };
      } else if (item == 'vfs') {
        host.vfs = {};
        $.each(items.vfs, function(k) {
          host.vfs[k] = { used: 0, free: 0, total: 0 };
        });
      } else if (item == 'if') {
        host.if = {};
        $.each(items.if, function(k) {
          host.if[k] = { in: 0, out: 0 };
        });
      } else if (item == 'services') {
        host.services = {};
        $.each(items.services, function(k) {
          host.services[k] = '...';
        });
      } else if (item == 'toner') {
        host.toner = {};
        $.each(items.toner, function(c) {
          host.toner[c] = { current: 0, total: 0 };
        });
      } else if (item == 'pagecount') {
        host.pagecount = {};
        $.each(items.pagecount, function(t) {
          host.pagecount[t] = 0;
        });
      }
    });

    data.hosts[hostname] = host;
  });

  // populate data.graphs according to config.graphs
  $.each(config.unifi, function(uap, items) {
    data.unifi[uap] = { users: 0, in: 0, out: 0, graph: items.graph };
  });

  // get and parse initial data
  parseData(getData(zabbix, ''));
  $('#timer').addClass('spin');

  // bind to vue
  var dash = new Vue({
    el: '#dashboard',
    data: data
  });

  // set timer
  setInterval(function() {
    $('#timer').removeClass('spin');
    data.timestamp = new Date().getTime();
    parseData(getData(zabbix, ''));
    $('#timer').addClass('spin');
  }, 10000);
});
