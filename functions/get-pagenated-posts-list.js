const mongoose = require('mongoose')

const Project = require('./models/project')

exports.handler = async (event, request, context) => {

    const slug = event.queryStringParameters['slug']
    const mongodb_username = process.env.MONGODB_USER
    const mongodb_password = process.env.MONGODB_PASSWORD
    const mongodb_database = process.env.MONGODB_DATABASE

    const uri = `mongodb+srv://${mongodb_username}:${mongodb_password}@abhikatlasmumbaiin.16jmi.mongodb.net/${mongodb_database}?retryWrites=true&w=majority`;

    mongoose.connect(uri, { useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:true})
    
    let page = event.queryStringParameters['page']
    let limit = 3
    let docCount = await Project.countDocuments()
    let countOfPageButton = Math.round(docCount/limit)
    console.log(docCount)
    console.log(countOfPageButton)
    //let htmlPagenation_front = `<div><ul class="pagination pagination-sm"><li class="page-item"><a class="page-link bg-secondary" href="/articles/index.html?page=1">First Page</a></li>`
    //let htmlPagenation_end = `<li class="page-item"><a class="page-link bg-secondary" href="/articles/index.html?page=${countOfPageButton}">Last Page</a></li></ul></div>`
    let htmlPagenation_front = `<div><ul class="pagination pagination-sm">`
    let htmlPagenation_end = `</ul></div>`
    
    let htmlPagenation_section = ""
    let activeclass = ""
    for(i=1; i<=countOfPageButton; i++ ){
        activeclass = ""
        if(page == i) 
        activeclass = 'active bg-dark'
        htmlPagenation_section += `<li class="page-item ${activeclass}" ><a class="page-link bg-secondary ${activeclass}" href="/articles/index.html?page=${i}">${i}</a></li>`
    }

    let htmlPagenation = htmlPagenation_front + htmlPagenation_section + htmlPagenation_end
    htmlPagenation = htmlPagenation.replace()

    const projects = await Project.find().sort({createdAt: 'desc'}).limit(limit).skip((page-1)*limit)
    //console.log(projects)
    
    
    return{
        statusCode: 200,
        headers: {
            /* Required for CORS support to work */
            'Access-Control-Allow-Origin': '*',
            /* Required for cookies, authorization headers with HTTPS */
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Methods': "GET, PUT, POST, DELETE, HEAD, OPTIONS"
          },
        body: JSON.stringify({projects,htmlPagenation})
    }
}