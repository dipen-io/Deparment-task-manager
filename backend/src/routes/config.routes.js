const User = require("../modules/user/user.model");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const departments = User.schema.path("department").enumValues;
    console.log("department :=> ",departments);
  res.status(200).json(departments);
});

module.exports = router;
