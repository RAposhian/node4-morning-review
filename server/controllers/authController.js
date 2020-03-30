const bcrypt = require('bcryptjs');

module.exports = {
   register: async(req, res) => {
      const db = req.app.get('db');
      const {username, password} = req.body;

      let user = await db.auth.check_user(username);
      if(user[0]) {
         return res.status(400).send('Username is in use already');
      };

      let salt = await bcrypt.genSaltSync(10);
      let hash = await bcrypt.hashSync(password, salt);

      let newUser = await db.auth.register_user({username, password: hash});
      req.session.user = newUser[0];
      res.status(201).send(req.session.user);
   },
   login: async(req, res) =>{
      const db = req.app.get('db');
      const {username, password} = req.body;

      let user = await db.auth.check_user(username);
      if(!user[0]) {
         return res.status(400).send('Username not found');
      };

      let authenticated = bcrypt.compareSync(password, user[0].password)
      if(!authenticated) {
         return res.status(400).send('Password incorrect')
      };

      delete user[0].password;

      req.session.user = user[0];
      res.status(201).send(req.session.user);
   },
   logout: (req, res) => {
      req.session.destroy();
      res.sendStatus(200);
   },
   getUser: (req, res) => {
      if (req.session.user) {
         res.status(200).send(req.session.user);
      } else {
         res.status(204).send('Please login or Register');
      }
   }
}