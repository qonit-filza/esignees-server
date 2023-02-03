const { Message, Notification, User } = require("../models/index");

class Controller {

    // SEND MESSAGE
    static async sendMessage(req, res, next){
        try {
            let UserIdSender = req.user.id
            let SenderEmail = req.user.name
            let {email, message} = req.body
            let user = await User.findOne({where: {email}})
            if (!user){
                throw {name : "NotFoundMessage"}
            }
            let data = await Message.create({
                UserIdSender,
                UserIdReceiver : user.id,
                message
            })
            let notification = await Notification.create({
                message : `You Have new message from ${SenderEmail}`,
                UserId : user.id
            })
            res.status(201).json(data)
        } catch (error) {
            next(error)
        }
    }

    // SHOW ALL MESSAGE
    static async showAllMessage(req, res, next){
        try {
            let id = req.user.id
            let messageReceiver = await Message.findAll({where : {UserIdReceiver : id}})
            let messageSender = await Message.findAll({where : {UserIdSender: id}})
            let message = {messageReceiver, messageSender}
            res.status(200).json(message)
        } catch (error) {
            next(error)
        }
    }

    // READ MESSAGE
    static async readMessage(req, res, next){
        try {
            let {id} = req.params
            let data = await Message.findByPk(id)
            let UserSender = await User.findByPk(data.UserIdSender)
            // let userReceiver = await User.findByPk(data.UserIdReceiver)
            res.status(200).json({data, UserSender})
        } catch (error) {
            next(error)
        }
    }

    static async changeMessage(req, res, next){
        try {
            let {id} = req.params
            let SenderEmail = req.user.name
            let messageUpdate = req.body.message
            let findMessage = await Message.findByPk(id)
            if (!findMessage){
                throw {name : "NotFoundMessage"}
            }
            await Message.update({
                message: `${findMessage.message}, ${messageUpdate}`,
                status : "SendBack"
            }, {where : {id : findMessage.id}})
            await Notification.create({
                message : `You Have new message from ${SenderEmail}`,
                UserId : findMessage.UserIdSender
            })
            res.status(201).json({message : "success sent message"})
        } catch (error) {
            next(error)
        }
    }
}


module.exports = Controller