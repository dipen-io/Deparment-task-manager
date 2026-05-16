const PERMISSION = Object.freeze({
  TASK: {
    CREATE: "task:create",
    READ: "task:read",
    UPDATE_ALL: "task:update:all",
    UPDATE_COMPLETE: "task:update:complete",
    DELETE: "task:delete",
    ASSIGN: "task:assign",
  },
  USER: {
    MANAGE: "user:manage",
  },
  DEPT: {
    MANAGE: "dept:manage",
  },
});

module.exports = { PERMISSION };
