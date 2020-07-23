const { Router } = require('express');
const { Resolver } = require('dns');
const isIp = require('is-ip');

const resolver = new Resolver();

resolver.setServers(['8.8.8.8']);

const router = Router();

router.get('/', (req, res) => {
  return res.json({ usage: 'Only /getip or /getname routes' });
});

router.get('/getip', (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400)
      .json({ error: "Mandatory send dns name, EX: 'getip/?name=www.inpe.br' " });
  }

  resolver.resolve4(name, (err, addressIp) => {
    if (err) {
      return res.status(400).json({ Aviso: `No IP associated with (${name}) name.` });
    }

    return res.json({
      name,
      ip: addressIp[0]
    });
  });
});

router.get('/getname', (req, res) => {
  const { ip } = req.query;

  if (!ip) {
    return res.status(400)
      .json({ Usage: "Mandatory send Ip address, EX: '/getname/?ip=150.163.105.29' " });
  }
  
  if (!isIp(ip)) {
    return res.status(400)
      .json({ Error: `${ip} it's not a valid Ip address.` });
  }

  resolver.reverse(ip, (err, addressName) => {
    if (err) {
      return res.status(400).json({ Aviso: `No name associated with (${ip}) IP.` });
    }

    return res.json({
      ip,
      name: addressName[0]
    });
  });
});

router.get('*', (req, res) => {
  res.redirect('/');
});

module.exports = router;
