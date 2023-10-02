const Customer = require('../models/Accounting/Customer'); // Import your User model from Sequelize


const create = async (req, res) => {
    try {
      const customer = await Customer.create(req.body);
      res.status(200).json({ data: customer });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `An error occurred while create customer: ${error.message}` });
    }
  };


  const update = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findByPk(id);
        if(!customer) throw new Error("No such Customer!");
        await customer.update(req.body);
        res.status(200).json({ data: customer });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `An error occurred while update customer: ${error.message}` });
    }
  };


  const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findByPk(id);
        if(!customer) throw new Error("No such Customer!");
        res.status(200).json({ data: customer });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `An error occurred while getById customer: ${error.message}` });
    }
  };


  const getAll = async (req, res) => {
    try {
        const customer = await Customer.findAll({ where: { user_id: req.user.userId }, order: [['id', 'DESC']] });
        if(!customer) throw new Error("No such Customer!");
        res.status(200).json({ data: customer });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `An error occurred while getAll customer: ${error.message}` });
    }
  };


  const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.destroy({ where: { id } });
        res.status(200).json({ data: customer });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `An error occurred while remove customer: ${error.message}` });
    }
  };
  
  
  module.exports = {
    create,
    update,
    getById,
    getAll,
    remove,
  };
  