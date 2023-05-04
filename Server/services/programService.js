const Program = require('../models/program');
const Sequelize = require('sequelize');
const Registration = require('../models/registration');

const programService = {
  async createProgram(programData) {
    try {
      const newProgram = await Program.create(programData);
      return { success: true, program: newProgram };
    } catch (error) {
      console.error('Error creating program:', error);
      return { success: false, error };
    }
  },

  async deleteProgram(programID) {
    try {
      const programToDelete = await Program.findOne({ where: { programID } });

      if (!programToDelete) {
        return { success: false, message: 'Program not found.' };
      }

      await Registration.destroy({ where: { programID } }); //destroy all registrations for this program

      await programToDelete.destroy();

      return { success: true, message: 'Program deleted successfully.' };
    } catch (error) {
      console.error('Error deleting program:', error);
      return { success: false, error };
    }
  },

  async getAllPrograms() {
    try {
      const programs = await Program.findAll({
        limit : 6
      });
      return programs;
    } catch (error) {
      console.error('Error getting all programs:', error);
      return error;
    }
  },
  async getProgramByName(name){
    try {
      const program = await Program.findAll({where: { name }});
      return { success: true, program};
    } catch (error) {
      console.error('Error getting program by name:',error);
      return { success: false, error};
    }
  },

  async searchProgramsByName(searchTerm) {
    try {
      const programs = await Program.findAll({
        where: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('name')),
          'LIKE',
          '%' + searchTerm.toLowerCase() + '%'
        ),
        limit : 6
      });

      return programs;
    } catch (error) {
      console.error("Error searching programs:", error);
      return null;
    }
  },


};

module.exports = programService;
