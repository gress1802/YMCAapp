var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');

const Account = require('../models/account.js');
const programService = require('../services/programService.js');
const User = require('../models/user.js');
const registrationService = require('../services/registrationService.js');
const Program = require('../models/program.js');
const Registration = require('../models/registration.js');
const AccountService = require('../services/accountService.js');
const Family = require('../models/family.js');
const FamilyMember = require('../models/family_member.js');
const { Op } = require('sequelize');

Account.associate({ Registration });
Registration.associate({ Account, Program });
Program.associate({ Registration });

Family.associate({ FamilyMember });
FamilyMember.associate({ Family, Account });


/*
THIS CODE IS ONLY RAN ONCE TO CREATE THE ACCOUNTS IN THE DATABASE
*CREATE ADMIN ACCOUNT* 
const adminAccount = Account.create({
  email: "gress2123@uwlax.edu",
  username: "Joseph",
  password: "111",
  status: "active",
  isAdmin: true,
  accountID: uuidv4().split('-').reduce((acc, val) => acc + parseInt(val, 16), 0) % 1000000000
}); 
*CREATE NONADMIN ACCOUNTS*
const janAccount = Account.create({
  email: "jdoe802@gmail.com",
  username: "Jane",
  password: "111",
  status: "active",
  isAdmin: false,
  accountID: uuidv4().split('-').reduce((acc, val) => acc + parseInt(val, 16), 0) % 1000000000
});
const janeAccount = Account.create({
  email: "landerson@gmail.com",
  username: "Luke",
  password: "111",
  status: "active",
  isAdmin: false,
  accountID: uuidv4().split('-').reduce((acc, val) => acc + parseInt(val, 16), 0) % 1000000000
});
const ainiAccount = Account.create({ 
  email: "aanderson@gmail.com",
  username: "Aini",
  password: "111",
  status: "active",
  isAdmin: false,
  accountID: uuidv4().split('-').reduce((acc, val) => acc + parseInt(val, 16), 0) % 1000000000
});
*/
//CREATE USERs ()

//testing programs

/*
 * GET Program List
 * This is an endpoint that will return a list of programs (JSON) (Used to populate the program portion of the list))
*/
router.get('/programs', async (req, res, next) => {
  try {
    const programs = await programService.getAllPrograms();
    res.status(200).send(programs);
  } catch (error) {
    console.error("Error getting programs:", error);
    res.status(500).send({ message: "Error getting programs" });
  }
});

router.post("/admin/programs", (req, res, next) => {
  //first check if the user is an admin
  if (req.session.user && req.session.user.isAdmin) {
    //get the parameters from the request body

    let programData = {
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      day: req.body.day,
      capacity: req.body.capacity,
      memberPrice: req.body.memberPrice,
      nonMemberPrice: req.body.nonMemberPrice,
      programID: uuidv4().split("-").reduce((acc, val) => acc + parseInt(val, 16), 0) % 1000000000,
      question: req.body.question,
      numParticipants: 0,
      status : 'true',
    };

    console.log(req.body);
    console.log(programData);

    if (
      !programData.name ||
      !programData.description ||
      !programData.location ||
      !programData.startDate ||
      !programData.endDate ||
      !programData.startTime ||
      !programData.endTime ||
      !programData.day ||
      !programData.capacity ||
      !programData.memberPrice ||
      !programData.nonMemberPrice
    ) {
      res.status(401).send({ msg: "Invalid parameters" });
    } else {
      programService.createProgram(programData).then((result) => {
        if (result.success) {
          res.status(200).send(result.program);
        } else {
          res.status(500).send({ msg: "Error creating program" });
        }
      });
    }
  } else {
    res.status(401).send({ msg: "Unauthorized" });
  }
});

router.get("/admin/programs", async (req,res,next) => {//takes in a query param of 'name':string
  let q = req.query;
  res.status(200).send(await programService.getProgramByName(q.name));
});

router.post('/programs/:pid', async (req, res, next) => {
  let pid = req.params.pid;
  let program = await Program.findByPk(pid);
  console.log(pid);
  if (!program) {
    res.status(401).send({ msg: 'Program does not exist' });
    return;
  }

  if (req.session.user) {
    // Get all programs the user is registered for
    const userRegistrations = await Registration.findAll({
      where: {
        accountID: req.session.user.accountID
      },
      include: {
        model: Program,
        required: true
      }
    });

    // Check for time conflicts
      const hasConflict = userRegistrations.some(registration => {
      const existingProgram = registration.Program;
      const startTimeConflict = program.startTime <= existingProgram.endTime && program.startTime >= existingProgram.startTime;
      const endTimeConflict = program.endTime >= existingProgram.startTime && program.endTime <= existingProgram.endTime;
      // Check if the program is on the same day (must be separated by a comma)
      const arrDays = existingProgram.day.split(",");
      return arrDays.length === 1 ? (program.day == arrDays[0]) && (startTimeConflict || endTimeConflict) : (program.day == arrDays[0] || program.day == arrDays[1]) && (startTimeConflict || endTimeConflict);
    });

    if (hasConflict) {
      res.status(400).send({ msg: 'Time conflict with another program' });
      return;
    }

    let registration = await registrationService.createRegistration(pid, req.session.user.accountID);
    if (registration.success == true) {
      res.status(200).send(program);
    } else {
      res.status(200).send(registration);
    }
  } else {
    let fullName = req.body.name;
    // You should create a guest user and then pass their ID to the createRegistration function
    // For now, I'm assuming you don't have a guest user implementation
    res.status(401).send({ msg: 'Guest registration not implemented' });
  }
});


router.get('/programs/search/:pid', async (req, res, next) => {
  try {
    const searchTerm = req.params.pid;
    const programs = await programService.searchProgramsByName(searchTerm);
    res.status(200).send(programs);
  } catch (error) {
    console.error("Error searching programs:", error);
    res.status(500).send({ message: "Error searching programs" });
  }
});

router.delete('/admin/programs/:pid', async (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin) {
    const pid = req.params.pid;

    try {
      const result = await programService.deleteProgram(pid);
      if (result) {
        res.status(200).send({ msg: 'Program deleted successfully' });
      } else {
        res.status(404).send({ msg: 'Program not found' });
      }
    } catch (error) {
      console.error("Error deleting program:", error);
      res.status(500).send({ msg: 'Error deleting program' });
    }
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

//get all accounts
router.get('/admin/account', async (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin) {
    try {
      const accounts = await AccountService.getAllAccounts();
      res.status(200).send(accounts);
    } catch (error) {
      console.error("Error getting accounts:", error);
      res.status(500).send({ msg: 'Error getting accounts' });
    }
  }
});

//find programs by account id
router.get('/admin/accounts/:accountID/programs', async (req, res) => {
  try {
    const accountID = req.params.accountID;
    const account = await Account.findByPk(accountID);

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    //account X registration X program
    const result = await Account.findAll({
      where: { accountID: accountID },
      include: [{
        model: Registration,
        include: [{
          model: Program,
        }]
      }]
    });

    //map through and convert to program
    const programs = result[0].Registrations.map(registration => registration.Program);

    res.json(programs);
  } catch (error) {
    console.error(error); // Log the error to see the details
    res.status(500).json({ error: 'Internal server error' });
  }
});

//search users by name
// Search users by name
router.get('/admin/accounts/search', async (req, res) => {
  try {
    const searchQuery = req.query.name;

    if (!searchQuery) {
      return res.status(400).json({ error: 'Name query parameter is required' });
    }

    const users = await Account.findAll({
      where: {
        username: {
          [Op.like]: `%${searchQuery}%`
        }
      }
    });

    res.json(users);
  } catch (error) {
    console.error(error); // Log the error to see the details
    res.status(500).json({ error: 'Internal server error' });
  }
});

// put cancel program 
// this endpoint sets the program status to false and cancels the program
router.put('/admin/programs/:pid/cancel', async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.isAdmin) res.status(401).send({ msg: 'Unauthorized' });
    const pid = req.params.pid;
    const program = await Program.findByPk(pid);

    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    program.status = 'false';
    await program.save();

    res.json(program);
  } catch (error) {
    console.error(error); // Log the error to see the details
    res.status(500).json({ error: 'Internal server error' });
  }
});

// put un cancel program 
// this endpoint sets the program status to false and cancels the program
router.put('/admin/programs/:pid/restart', async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.isAdmin) res.status(401).send({ msg: 'Unauthorized' });
    const pid = req.params.pid;
    const program = await Program.findByPk(pid);

    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    program.status = 'true';
    await program.save();

    res.json(program);
  } catch (error) {
    console.error(error); // Log the error to see the details
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Put account inactive
// This endpoint sets the account status to inactive thus preventing the user from logging in
router.put('/admin/accounts/:accountID/inactive', async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.isAdmin) res.status(401).send({ msg: 'Unauthorized' });
    const accountID = req.params.accountID;
    const account = await Account.findByPk(accountID);
    if (account.isAdmin) return res.status(200).send({ msg: "Don't do that"});

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    account.status = 'inactive';
    await account.save();

    res.json(account);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Put account active
// This endpoint sets the account status to active thus allowing the user to log in
router.put('/admin/accounts/:accountID/active', async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.isAdmin) res.status(401).send({ msg: 'Unauthorized' });
    const accountID = req.params.accountID;
    const account = await Account.findByPk(accountID);

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    account.status = 'active';
    await account.save();

    res.json(account);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Auth user programs
// This endpoint gets all the programs that the user is registered for
router.get('/auth/programs', async (req, res) => {
  try {
    const accountID = req.session.user.accountID;
    const account = await Account.findByPk(accountID);

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    //account X registration X program
    const result = await Account.findAll({
      where: { accountID: accountID },
      include: [{
        model: Registration,
        include: [{
          model: Program,
        }]
      }]
    });

    //map through and convert to program
    const programs = result[0].Registrations.map(registration => registration.Program);

    res.json(programs);
  } catch (error) {
    console.error(error); // Log the error to see the details
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unregister the authenticated user from a program
// DELETE /auth/programs/:programID
// Unregister the authenticated user from the specified program
router.delete('/auth/programs/:programID', async (req, res) => {
  try {
    const accountID = req.session.user.accountID;
    const programID = req.params.programID;

    // Find the registration for the user and the program
    const registration = await Registration.findOne({
      where: {
        accountID: accountID,
        programID: programID
      }
    });

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    // Find the program
    const program = await Program.findByPk(programID);

    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    // Decrement the numParticipants field
    program.numParticipants = Math.max(0, program.numParticipants - 1);
    await program.save();

    // Delete the registration
    await registration.destroy();

    res.json({ message: 'Unregistered successfully' });
  } catch (error) {
    console.error(error); // Log the error to see the details
    res.status(500).json({ error: 'Internal server error' });
  }
});

// This endpoint gets all families and their members
// GET /api/v1/families
// This endpoint retrieves all families and their members
router.get('/admin/families', async (req, res) => {
  try {
    // Retrieve all families and their family members
    const families = await Family.findAll({
      include: [{
        model: FamilyMember,
        required: true,
        include: [{
          model: Account,
          attributes: ['accountID', 'email', 'username', 'status', 'isAdmin']
        }]
      }]
    });

    // Format the response data
    const responseData = families.map(family => {
      return {
        familyID: family.familyID,
        members: family.FamilyMembers.map(familyMember => familyMember.Account)
      };
    });

    res.json(responseData);
  } catch (error) {
    console.error(error); // Log the error to see the details
    res.status(500).json({ error: 'Internal server error' });
  }
});








module.exports = router;
