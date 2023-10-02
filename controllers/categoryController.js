const Category = require('../models/Inventory/Category'); // Import your User model from Sequelize


const create = async (req, res) => {
    try {
      const category = await Category.create(req.body);
      res.status(200).json({ data: category });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `An error occurred while create category: ${error.message}` });
    }
  };


  const update = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if(!category) throw new Error("No such Category!");
        await category.update(req.body);
        res.status(200).json({ data: category });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `An error occurred while update category: ${error.message}` });
    }
  };


  const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if(!category) throw new Error("No such Category!");
        res.status(200).json({ data: category });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `An error occurred while getById category: ${error.message}` });
    }
  };


  const getAll = async (req, res) => {
    try {
        const category = await Category.findAll({ where: { user_id: req.user.userId }, order: [['id', 'DESC']] });
        if(!category) throw new Error("No such Category!");
        res.status(200).json({ data: category });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `An error occurred while getAll category: ${error.message}` });
    }
  };


  const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.destroy({ where: { id } });
        res.status(200).json({ data: category });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `An error occurred while remove category: ${error.message}` });
    }
  };
  
  
  module.exports = {
    create,
    update,
    getById,
    getAll,
    remove,
  };
  