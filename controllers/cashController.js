const Cash = require('../models/Accounting/CashTransactions'); // Import your User model from Sequelize


const create = async (req, res) => {
    try {
      const cash = await Cash.create(req.body);
      res.status(200).json({ data: cash });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `An error occurred while create cash: ${error.message}` });
    }
  };


  const update = async (req, res) => {
    try {
        const { id } = req.params;
        const cash = await Cash.findByPk(id);
        if(!cash) throw new Error("No such Cash!");
        await cash.update(req.body);
        res.status(200).json({ data: cash });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `An error occurred while update cash: ${error.message}` });
    }
  };


  const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const cash = await Cash.findByPk(id);
        if(!cash) throw new Error("No such Cash!");
        res.status(200).json({ data: cash });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `An error occurred while getById cash: ${error.message}` });
    }
  };


  const getAll = async (req, res) => {
    try {
        const cash = await Cash.findAll({ where: { user_id: req.user.userId }, order: [['id', 'DESC']] });
        if(!cash) throw new Error("No such Cash!");
        res.status(200).json({ data: cash });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `An error occurred while getAll cash: ${error.message}` });
    }
  };


  const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const cash = await Cash.destroy({ where: { id } });
        res.status(200).json({ data: cash });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `An error occurred while remove cash: ${error.message}` });
    }
  };
  
  
  module.exports = {
    create,
    update,
    getById,
    getAll,
    remove,
  };
  