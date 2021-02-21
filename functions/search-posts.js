const mongoose = require('mongoose')

const Project = require('./models/project')

exports.handler = async (event, context) => {

    const mongodb_username = process.env.MONGODB_USER
    const mongodb_password = process.env.MONGODB_PASSWORD
    const mongodb_database = process.env.MONGODB_DATABASE

    const uri = `mongodb+srv://${mongodb_username}:${mongodb_password}@abhikatlasmumbaiin.16jmi.mongodb.net/${mongodb_database}?retryWrites=true&w=majority`;

    mongoose.connect(uri, { useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:true})
    let q = event.queryStringParameters['q'].trim().replace(/[&\/\\#+()$~%'":*?<>{}]/g,'')
    console.log('Search Query::::: ',q)
    let projects = []
    try{
        projects =  await Project.find( 
            {'$or':[
                {'showHtml':{'$regex':new RegExp(q), '$options':'i'}},
                {'title':{'$regex':new RegExp(q), '$options':'i'}}]
            }, 
            {
            _id: 0,
            __v:0         
            }, (err, data) => {
                if(err){
                    console.log(err)
                    return{
                        statusCode: 200,
                        body: JSON.stringify([])
                    }
                } else {
                    console.log('Data Length: ',data.length)
                    if(data.length > 0) {
                        projects = data
                    }
                    else {
                        
                    }
                }
            }
        )

    } catch(err){
        console.log(err)
        return{
            statusCode: 200,
            body: JSON.stringify([])
        }
    }
    return{
        statusCode: 200,
        body: JSON.stringify(projects)
    }
    
}