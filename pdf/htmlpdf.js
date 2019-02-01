var hbs = require('hbs')
var fs = require('fs')
var pdf = require('html-pdf')

hbs.registerHelper("setStack", (number) => {
    // 5
    // -4
    task = number + 1
    if((task-4) >= 1){
        if(((task-4)%5) === 0){
            return "work_order_skip"
        } else {
            return "work_order"
        }
    } else {
        if((task-4) === 0){
            return "work_order_skip"
        } else {
            return "work_order"
        }
    }
})

var createPDF = (data) => {
    var slug = hbs.compile(fs.readFileSync(__dirname + "/test.hbs", "utf-8"))

    return new Promise((resolve, reject) => {
        pdf.create(slug(data, { 'format': 'A4'})).toBuffer((err, buffer) => {
            if (err){
            	reject(err)
            }
            resolve(buffer)
        });
    })

}

module.exports = {
    createPDF
}