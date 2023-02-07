const { Company } = require("../models/index");

async function authorizationStatus(req, res, next) {
  try {
    let id = req.user.idCompany;

    let company = await Company.findByPk(id);

    if (company == "Free") {
      throw { name: "Free" };
    }
    
    next();
  } catch (error) {
    next(error);
  }
}


module.exports = {authorizationStatus}