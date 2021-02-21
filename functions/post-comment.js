const mongoose = require('mongoose')

const Comment = require('./models/comment')

exports.handler = async (event, request, context) => {
    //console.log('Method:::::: ',event.httpMethod)
    if (event.httpMethod == "POST") {
        const mongodb_username = process.env.MONGODB_USER
        const mongodb_password = process.env.MONGODB_PASSWORD
        const mongodb_database = process.env.MONGODB_DATABASE

        const uri = `mongodb+srv://${mongodb_username}:${mongodb_password}@abhikatlasmumbaiin.16jmi.mongodb.net/${mongodb_database}?retryWrites=true&w=majority`;

        mongoose.connect(uri, { useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:true})
        
        let data = JSON.parse(event.body)
        let comment = new Comment({
            name: data.name.replace(/[&\/\\#+()$~%'":*?<>{}]/g,'_'),
            comment: data.comment.replace(/[&\/\\#+()$~%'":*?<>{}]/g,'_')
        })
        comment = await comment.save()
        return{
            statusCode: 200,
            headers: {
                /* Required for CORS support to work */
                'Access-Control-Allow-Origin': '*',
                /* Required for cookies, authorization headers with HTTPS */
                'Access-Control-Allow-Credentials': true
              },
            body: JSON.stringify(comment)
        }
    } else{
        return{
            statusCode: 404,
            headers: {
                /* Required for CORS support to work */
                'Access-Control-Allow-Origin': '*',
                /* Required for cookies, authorization headers with HTTPS */
                'Access-Control-Allow-Credentials': true
              },
            body: 'Get method not allowed'
        }
    }
    
}