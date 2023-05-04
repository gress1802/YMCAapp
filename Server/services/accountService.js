const Account = require('../models/account');

async function getAccountByEmail(email) {
  try {
    const account = await Account.findOne({
      where: { email },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    return account;
  } catch (error) {
    console.error('Error getting account by email:', error);
    return null;
  }
}

//get all accounts
async function getAllAccounts() {
  try {
    const accounts = await Account.findAll();
    return accounts;
  } catch (error) {
    console.error('Error getting all accounts:', error);
    return null;
  }
}

module.exports = {
  getAccountByEmail,
  getAllAccounts,
};
