const Employee = require('../models/employee');
const Account = require('../models/account');

async function createEmployee(firstName, lastName, admin, status, accountID) {
  try {
    const employee = await Employee.create({
      firstName,
      lastName,
      admin,
      status,
      accountID,
    });

    return employee;
  } catch (error) {
    console.error('Error creating employee:', error);
    return null;
  }
}

async function getEmployeeByID(employeeID) {
  try {
    const employee = await Employee.findByPk(employeeID);

    if (!employee) {
      throw new Error('Employee not found');
    }

    return employee;
  } catch (error) {
    console.error('Error getting employee by ID:', error);
    return null;
  }
}

async function getAllEmployees() {
  try {
    const employees = await Employee.findAll();

    return employees;
  } catch (error) {
    console.error('Error getting all employees:', error);
    return null;
  }
}

async function deleteEmployee(employeeID) {
  try {
    const employee = await Employee.findByPk(employeeID);

    if (!employee) {
      throw new Error('Employee not found');
    }

    await employee.destroy();

    return true;
  } catch (error) {
    console.error('Error deleting employee:', error);
    return false;
  }
}

module.exports = {
  createEmployee,
  getEmployeeByID,
  getAllEmployees,
  deleteEmployee,
};
