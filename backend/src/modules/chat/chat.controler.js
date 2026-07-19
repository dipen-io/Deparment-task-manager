const { getChatHistory, deleteDepartment } = require('./chat.service');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');


exports.deleteDepartments = asyncHandler(async (req, res) => {
    const { deptId } = req.params;
    const deleteDepartment = await deleteDepartment(deptId);
    res.status(200).json(new ApiResponse(200, "delete deparment", deleteDepartment));
})

exports.getChatHistory = asyncHandler(async (req, res) => {
    const { deptId } = req.params;
    const { before } = req.query;
    const chat = await getChatHistory(deptId, before);
    res.status(200).json(new ApiResponse(200, "fetch chat history", 
        {
            chat, count: chat.length,
            hasMore : chat.length === 50,
        }
    ));
})
