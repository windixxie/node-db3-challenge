const db = require("../data/dbConfig");

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
  update,
  remove
}

function find() {
  return db("schemes")
}

function findById(id) {
  return db("schemes")
    .where({ id })
    .first() || null;
}

function findSteps(id) {
  return db("schemes")
    .join("steps", "steps.scheme_id", "schemes.id")
    .select("steps.id", "schemes.scheme_name", "steps.step_number", "steps.instructions")
    .where("schemes.id", id)
}

async function add(scheme) {
  const [id] = await db("schemes")
    .insert(scheme, "id")
    .returning("*");
  return findById(id);
}

async function addStep(step, scheme_id) {
  const [id] = await db("steps")
    .insert({ ...step, scheme_id }, "id")
    .returning("*");
  return await findById(id);
}

async function update(changes, id) {
  await db("schemes")
    .where({ id })
    .update(changes);
  return findById(id);
}

async function remove(id) {
  const removedScheme = await findById(id)
  const removed = await db("schemes")
    .where({ id })
    .del();
  return removed ? removedScheme : null;
}