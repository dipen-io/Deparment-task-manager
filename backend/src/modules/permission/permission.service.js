const Permission = require("./permission.model");
const AppError = require("../../utils/AppError");

const getPerm = async (req) => {
  // desctructing data
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const { search, sortBy } = req.query;

  // build an dynamic database query object
  const queryObj = {};

  // text search
  if (search) {
    queryObj.name = { $regex: search, $options: "i" }; // Case-insensitive partial search
  }

  // sorting rules
  let sortCriteria = "-createdAt"; // newest first
  if (sortBy === "name_asc") sortCriteria = "name";
  if (sortBy === "name_desc") sortCriteria = "-name";

  // Db Queries
  // lean():  Performance booster: returns plain JS objects instead of heavy Mongoose docs
  const [permissions, totalItems] = await Promise.all([
    Permission.find(queryObj).sort(sortCriteria).skip(skip).limit(limit).lean(),
    Permission.countDocuments(queryObj),
  ]);

  // Corner Case: Handle out-of-bounds pagination gracefully
  if (skip > totalItems && totalItems > 0) {
    return next(new AppError("This page does not exist", 404));
  }

  // 5. Calculate pagination metadata for the client UI
  const totalPages = Math.ceil(totalItems / limit);
  return {
    results: permissions.length,
    pagination: {
      currentPage: page,
      limit,
      totalPages,
      totalItems,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    data: permissions,
  };
};

// CREATE PERMISSION
const createPerm = async (userId, { name, desc }) => {
  try {
    const normaliseName = name.trim().toUpperCase();
    const permission = await Permission.create({
      name: normaliseName,
      desc: desc?.trim() || "",
      createdBy: userId
    });
    return permission;

  } catch (error) {
    if (error.code === 11000) {
      throw new AppError(
        `The permission '${name.trim().toUpperCase()}' already exists.`,
        409,
      );
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((el) => el.message);
      throw new AppError(`Validation failed: ${messages.join(", ")}`, 400);
    }
    throw error;
  }
};

const updatePerm = async (id, { name, desc }) => {
    const updateFields = {};
    if (name) updateFields.name = name.trim().toUpperCase();
    if (desc !== undefined) updateFields.desc = desc.trim();
    try {
        const updatePerm = await Permission.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { returnDocument: 'after', runValidators: true }
        )

        if (!updatePerm) {
            // throw new AppError("Invalid Permission ID", 404);
            throw new AppError("No permission found with that ID", 404);
        }

        return updatePerm;

    } catch(error) {
        if (error.code === 11000) {
            throw new AppError("This permission name is already taken.", 409);
        }
        throw error;
    }
};

const deletePerm = async (id) => {
  // verify if
  const validPermId = await Permission.findById(id);
  if (!validPermId) {
    throw new AppError("Invalid Permission ID", 404);
  }
  await Permission.findByIdAndDelete(id);
  return;
};

module.exports = { getPerm, createPerm, updatePerm, deletePerm };
