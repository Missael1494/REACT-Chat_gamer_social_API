const router = require("express").Router(); // podemos hacer varios routes y acceder al mismo modelo
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save(); //se crea en la base de datos
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }); // hace una busqueda de acuerdo al modelo  usuario se especifica uno de los campos que tiene este modelo modelo y la informacion que mandamos en el iput del login par
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password) // comparar los passwords del que se escribio con el usuario que se encontro por el passwords
    !validPassword && res.status(400).json("wrong password")

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
