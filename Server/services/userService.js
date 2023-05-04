const User = require('../models/user');
const Account = require('../models/account');

async function createUser(firstName, lastName, member, status, accountID) {
  try {
    const user = await User.create({
      firstName,
      lastName,
      member,
      status,
      accountID,
    });

    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

async function getUserByID(userID) {
  try {
    const user = await User.findByPk(userID);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

async function getAllUsers() {
  try {
    const users = await User.findAll();

    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    return null;
  }
}

async function deleteUser(userID) {
  try {
    const user = await User.findByPk(userID);

    if (!user) {
      throw new Error('User not found');
    }

    await user.destroy();

    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}

module.exports = {
  createUser,
  getUserByID,
  getAllUsers,
  deleteUser,
};
