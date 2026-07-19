const Message = require('./chat.model');
const Department = require('../department/department.model');
const AppError = require('../../utils/AppError');

const getChatHistory = async (deptId) => {
    try {
        const messages = await Message.find({ departmentId: deptId })
            .sort({ createdAt: -1 }) // Get the 50 newest records from the database first
            .limit(50) 
            .lean(); 

        return messages.reverse();

    } catch (error) {
        throw new AppError("Failed to retrieve chat history.", 500);
    }
}

// need to call this function where department is deleted
const deleteDepartment = async (deptId) => {
    try {
       const targetDept = await Department.findByIdAndDelete(deptId); 
        if (!targetDept) {
           throw new AppError("Department not found.", 404);
        }
       // CASCADE DELETE: Instantly clean up all messages associated with it
        await Message.deleteMany({ departmentId: deptId });
        return;
    } catch (error) {
        throw new AppError("Server error during message chat deletion.", 500);
    }
}

module.exports = { getChatHistory, deleteDepartment };
