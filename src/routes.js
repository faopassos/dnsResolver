const { Router } = require('express');
const { Resolver } = require('dns');
const isIp = require('is-ip');

const resolver = new Resolver();

resolver.setServers(['150.163.55.128']);

const router = Router();

// const ignoreRoutes = (req, res, next) => {
//   if (req.url !== '/getip/*' || req.url !== '/getname/*') {
//     return res.redirect('/');
//   }
  
//   next();
// };

// router.use(ignoreRoutes);

router.get('/', (req, res) => {
  return res.send({ usage: 'Only /getip or /getname routes' });
});

router.get('/getip', (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400)
      .json({ error: "Mandatory send dns name, EX: 'getip/?name=www.inpe.br'" });
  }

  resolver.resolve4(name, (err, addressIp) => {
    if (err) {
      return res.status(400).send({ Aviso: `No IP associated with (${name}) name.` });
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
      .json({ Usage: "Mandatory send Ip address, EX: '/getname/?ip=150.163.105.29'" });
  }
  
  if (!isIp(ip)) {
    return res.status(400)
      .json({ Error: `${ip} it's not a valid Ip address.` });
  }

  resolver.reverse(ip, (err, addressName) => {
    if (err) {
      return res.status(400).send({ Aviso: `No name associated with (${ip}) IP.` });
    }

    return res.json({
      ip,
      name: addressName[0]
    });
  });
});

module.exports = router;
