const { body,param } = require('express-validator');

const createTaskValidator = [
    body('title')
        .trim()
        .notEmpty().withMessage('Task title is required')
        .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters')
        .escape(), // Converts <script> tags to safe HTML entities

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required'),

    body('status')
        .optional()
        .trim()
        .isIn(['pending', 'in-progress', 'completed'])
        .withMessage('Status must be pending, in-progress, or completed'),

    body('assignedTo')
        .optional()
        .trim()
        .notEmpty().withMessage('You must assign this task to a user')
        .isMongoId().withMessage('Invalid User ID format')
];

const taskIdValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid Task ID format')
];

const updateTaskValidator = [
    body('title').optional().trim().isLength({ max: 100 }).escape(),
    body('description').optional().trim(),
    body('status').optional().trim().isIn(['pending', 'in-progress', 'completed']),
    body('assignedTo').optional().trim().isMongoId()
];

const assignTaskValidator = [
    param('id')
        .isMongoId().withMessage('Invalid Task ID format'),
    body('assignedTo')
        .trim()
        .notEmpty().withMessage('You must provide an Employee ID to assign this task to')
        .isMongoId().withMessage('Invalid Employee ID format')
];

module.exports = {
    createTaskValidator,
    updateTaskValidator,
    taskIdValidator,
    assignTaskValidator
};
