const Registration = require('../models/registration');
const Program = require('../models/program');
const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const Account = require('../models/account');

async function createRegistration(programID, accountID) {
  try {
    // Retrieve the program with the given programID
    const program = await Program.findByPk(programID);
    // Find existing registration
    const existingRegistration = await Registration.findOne({ where: { programID, accountID } });
    if (existingRegistration) {
      return { success: false, message: 'Registration already exists' };
    }

    // Check if the program exists
    if (!program) {
      return { success: false, message: 'Program not found' };
    }

    // Check if the number of participants is less than the capacity
    if (program.numParticipants < program.capacity) {
      const registration = await Registration.create({
        programID,
        accountID,
        registrationID : uuidv4().split("-").reduce((acc, val) => acc + parseInt(val, 16), 0) % 1000000000,
      });

      // Increment numParticipants in the program
      program.numParticipants += 1;
      await program.save();

      return { success: true, message: 'Registration created', registration };
    } else {
      return { success: false, message: 'Program capacity reached' };
    }
  } catch (error) {
    return { success: false, message: 'Error creating registration' };
  }
}



async function getRegistrationByID(registrationID) {
  try {
    const registration = await Registration.findByPk(registrationID, {
      include: [Program, Account],
    });

    if (!registration) {
      throw new Error('Registration not found');
    }

    return registration;
  } catch (error) {
    console.error('Error getting registration by ID:', error);
    return null;
  }
}

async function getAllRegistrations() {
  try {
    const registrations = await Registration.findAll({
      include: [Program, Account],
    });

    return registrations;
  } catch (error) {
    console.error('Error getting all registrations:', error);
    return null;
  }
}

async function deleteRegistration(registrationID) {
  try {
    const registration = await Registration.findByPk(registrationID);

    if (!registration) {
      throw new Error('Registration not found');
    }

    await registration.destroy();

    return true;
  } catch (error) {
    console.error('Error deleting registration:', error);
    return false;
  }
}

module.exports = {
  createRegistration,
  getRegistrationByID,
  getAllRegistrations,
  deleteRegistration,
};
