const { Pool, Client } = require('pg');

var dbURL = process.env.DATABASE_URL || "postgres://postgres:password@localhost:5432/sot"; //Change According to Database Requirements


const pgpool = new Pool({

    connectionString: dbURL,
});

var checkVIN = function(VIN){
    return new Promise((resolve, reject) => {
        
        pgpool.query('SELECT VIN FROM vehicle WHERE VIN LIKE $1', [VIN] , (err, res) => {         
            if (err) {
                reject(err)
            } else {
                if(res.rows.length == 0){
                    resolve({result:1}) // vin is not in DB
                }else{
                    resolve({result:0}) // vin is in DB
                }
            }
        })
    })
}

module.exports = {
	checkVIN
}