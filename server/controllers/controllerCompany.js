const { User, Company } = require('../models/index');
const midtransClient = require('midtrans-client');

class Controller {
    static async fetchCompany(req, res, next){
        try {
            let id = req.user.idCompany
            let company = await Company.findByPk(id)
            res.status(200).json(company)
        } catch (error) {
            next(error)
        }
    }

      // MIDTRANS
  static async createTokenMidtrans(req, res, next){
    try {
      const id = +req.user.id;
      const email = req.user.name
      const price = +req.params.price;

      let snap = new midtransClient.Snap({
        isProduction : false,
        serverKey : process.env.MIDTRANS_SERVER_KEY
    });

    const user = await User.findByPk(id);

    let parameter = {
      transaction_details: {
          order_id: "ESIGNEES_Transaction" + Math.floor(1000000 + Math.random()*9999999),
          gross_amount: price,
      },
      credit_card:{
          secure : true
      },
      customer_details: {
          email: user.email,
      }
  };
  const midtransToken = await snap.createTransaction(parameter);
  res.status(201).json(midtransToken);
    } catch (error) {
      next(error)
    }
  }

  // HANDLE DUE DATE
  static async editDueDate(req, res, next){
    try {
      let id = req.user.idCompany
      const newDate = new Date()
      let data = await Company.update({
          dueDate : newDate.setDate(newDate.getDate() - 30),
          status : "Subscription"
        }, {where : {id}})
      res.status(201).json({message : `Congrats, your subscription was successfully!`})
    } catch (error) {
      next(error)
    }
  }

  static async checkDate(req, res, next){
    try {
        let id = req.user.idCompany
        let data = await Company.findByPk(id)

        if (data.dueDate < new Date()){
            await Company.update({
                dueDate : new Date(),
                status : "Free"
            }, {where : {id}})
            return res.status(201).json({message : "Your subscription was expired, please payment for more"})
        }
    } catch (error) {
        next(error)
    }
  }
}

module.exports = Controller