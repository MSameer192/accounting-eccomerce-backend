const User = require('../models/Ecommerce/User'); // Import your User model from Sequelize
const { comparePassword, createToken, hashedPassword } = require('../services/auth');

// Signup Controller
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user with the given email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new Error("User already exists!")

    // Hash the password
    const hashPassword = await hashedPassword(password);

    // Create a new user
    const newUser = await User.create({ ...req.body, password: hashPassword });

    // Generate a JWT token
    const token = createToken({ userId: newUser.id });

    res.status(201).json({ message: 'User registered successfully', token, userId: newUser.id, user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `An error occurred while signup user: ${error.message}` });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("User not exist!")

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) throw new Error("Password not matched!")

    // Generate a JWT token
    const token = createToken({ userId: user.id });

    res.status(200).json({ message: 'User login successfully', token, userId: user.id, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `An error occurred while login user: ${error.message}` });
  }
};

const getById = async (req, res) => {
  try {
      const { id } = req.params;
      const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
      if(!user) throw new Error("No such User exists!");
      res.status(200).json({ data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `An error occurred while getById user: ${error.message}` });
  }
};

const getAll = async (req, res) => {
  try {
      const user = await User.findAll({ order: [['id', 'ASC']], attributes: { exclude: ['password'] } });
      if(!user) throw new Error("No such Course!");
      res.status(200).json({ data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `An error occurred while getAll user: ${error.message}` });
  }
};

const remove = async (req, res) => {
  try {
      const { id } = req.params;
      const user = await User.destroy({ where: { id } });
      res.status(200).json({ data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `An error occurred while remove user: ${error.message}` });
  }
};

const update = async (req, res) => {
  try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if(!user) throw new Error("No such User!");
      await user.update(req.body);
      res.status(200).json({ data: user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `An error occurred while update user: ${error.message}` });
  }
};

module.exports = {
  signup,
  login,
  getById,
  getAll,
  remove,
  update
};
