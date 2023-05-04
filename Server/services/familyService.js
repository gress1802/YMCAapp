const Family = require('../models/family');
const Account = require('../models/account');

async function addFamilyMember(familyID, accountID) {
  try {
    await Family.create({ familyID, accountID });
  } catch (error) {
    console.error('Error adding family member:', error);
    throw error;
  }
}

async function removeFamilyMember(familyID, accountID) {
  try {
    await Family.destroy({
      where: { familyID, accountID },
    });
  } catch (error) {
    console.error('Error removing family member:', error);
    throw error;
  }
}

async function getFamilyMembers(familyID) {
  try {
    const familyMembers = await Family.findAll({
      where: { familyID },
      include: [{
        model: Account,
        required: true,
      }],
    });

    return familyMembers.map(member => member.Account);
  } catch (error) {
    console.error('Error getting family members:', error);
    throw error;
  }
}

module.exports = {
  addFamilyMember,
  removeFamilyMember,
  getFamilyMembers,
};
