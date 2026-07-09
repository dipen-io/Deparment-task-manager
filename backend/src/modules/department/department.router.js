const {
    createDepartment,
    getDepartment,
    delDepartment,
    updateDepartment,
    assignDepartment,
    unassingDepartment,
   getDeptCount,
} = require("./department.controller");
const validate = require("../../middleware/input-validate");
const { authorize, protect } = require("../../middleware/auth");
const { ROLES } = require("../../constant/roles");
const { deptValidator } = require("./department.validate");

const router = require("express").Router();

router.get("/get", getDepartment);
router.get("/count", getDeptCount);
router.post("/", deptValidator, validate, createDepartment);

router.post("/unassign/:id", unassingDepartment);

router.post("/:deptId/:userId", assignDepartment);
// router.post("/", addPermissionValidator, validate, protect, authorize(ROLES.ADMIN), createPermission);
router.patch("/:id", updateDepartment);
router.delete("/:id", delDepartment);

module.exports = router;
