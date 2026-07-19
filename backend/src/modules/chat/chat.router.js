const router = require("express").Router()
const  { deleteDepartments, getChatHistory } = require("./chat.controler");


router.get("/chat/:deptId", getChatHistory);

module.exports = router;
