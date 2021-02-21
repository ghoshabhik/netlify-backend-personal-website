const mongoose = require('mongoose')

const Project = require('./models/project')

exports.handler = async (event, context) => {

    const mongodb_username = process.env.MONGODB_USER
    const mongodb_password = process.env.MONGODB_PASSWORD
    const mongodb_database = process.env.MONGODB_DATABASE

    const uri = `mongodb+srv://${mongodb_username}:${mongodb_password}@abhikatlasmumbaiin.16jmi.mongodb.net/${mongodb_database}?retryWrites=true&w=majority`;

    mongoose.connect(uri, { useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:true})
    const projects = await Project.find().sort({createdAt: 'desc'})
    console.log(projects)
    return{
        statusCode: 200,
        body: JSON.stringify(projects)
    }
}