const { Pool, Client } = require('pg');

var dbURL = process.env.DATABASE_URL || "postgres://postgres:password@localhost:5432/sot"; //Change According to Database Requirements


const pgpool = new Pool({
    connectionString: dbURL,
});

/* Changed Functions -Homy Oct 30, 2018*/
var getSearchData = (searchQuery, searchType) => {
    return new Promise((resolve, reject) => {
        
        //Regex to ensure no special characters
        var searchRegex = /^[a-zA-Z0-9]+$/;
        
        if(searchRegex.test(searchQuery) || searchQuery == ''){
            console.log("Search Regex Passed");
            var searchText = searchQuery + '%';
            pgpool.query('SELECT * FROM customer INNER JOIN vehicle ON customer.cust_id = vehicle.cust_id WHERE '+searchType+' LIKE $1', [ searchText] , (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve({status: "success", data: res.rows});
                }
            })
        }else{
            console.log("Search Regex Failed");
            reject({status: "fail"});
        }
    	
    })
}

module.exports = {
	getSearchData,
}