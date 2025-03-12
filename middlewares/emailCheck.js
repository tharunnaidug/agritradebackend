import seller from '../models/seller.model.js';
import userModel from '../models/user.model.js';

export const checkEmailExists = async (req, res, next) => {
    const { email } = req.body;
  
    try {
      const user = await userModel.findOne({ email });
      if (user) {
        return res.status(400).send({ message: 'Email already exists' });
      }
      next();
    } catch (error) {
      console.error('Error checking email existence:', error);
      res.status(500).send({ message: 'Internal Server error' });
    }
  };
export const checkSellerEmailExists = async (req, res, next) => {
    const { email } = req.body;
  
    try {
      const user = await seller.findOne({ email });
      if (user) {
        return res.status(400).send({ message: 'Email already exists' });
      }
      next();
    } catch (error) {
      console.error('Error checking email existence:', error);
      res.status(500).send({ message: 'Internal Server error' });
    }
  };