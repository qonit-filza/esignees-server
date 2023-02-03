const bcrypt = require("bcryptjs");

const hashPassword = (password) => {
  const hash = bcrypt.hashSync(password, 8);
  return hash;
};

const comparePassword = (password, hash) => {
  const compare = bcrypt.compareSync(password, hash);
  return compare;
};

module.exports = { hashPassword, comparePassword };