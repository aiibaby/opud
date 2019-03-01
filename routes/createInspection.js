
const { Pool, Client } = require('pg');

var dbURL = process.env.DATABASE_URL || "postgres://postgres:password@localhost:5432/sot"; //Change According to Database Requirements


const pgpool = new Pool({

    connectionString: dbURL,
});

const runQuery = async (query, param) => {
    const client = await pgpool.connect()
    try {
        const res = await client.query(query, param)
        return res
    } finally {
        client.release()
    }
}


// var insertCustomer = (req) => {
//     return new Promise((resolve, reject) => {


//         var data = [req.body.firstName, req.body.lastName, req.body.homePhone, req.body.cellPhone, req.body.street, req.body.city, req.body.postalCode, req.body.date];
//         const query = {
//             // give the query a unique name
//             name: 'insertCustomer',
//             text: insertCustomerQuery,
//             values: data
//         };

//         pool.query(query)
//             .then(result => resolve({customerID: result.rows[0]}))
//             .catch(err => reject(err))

//     })
// }

// var insertVehicles = (info) => {
//     return new Promise((resolve, reject) => {
//         const query = {
//             // give the query a unique name
//             name: 'insertVehicle',
//             text: insetVehicleQuery,
//             values: [info[0].vin, parseInt(info[0].year), info[0].license, info[0].make, info[0].model, info[0].color, info[2], info[1].cust_id]
//         };

//         pool.query(query)
//             .then(result => resolve({vehicleID: result.rows[0].vehicle_id}))
//             .catch(err => reject(err))
//     })
// }

const insertInspection = async (LFPres, RFPres, LRPres, RRPres, SparePres, LFTread, RFTread, LRTread, RRTread, SpareTread, LFPads, RFPads, LRPads, RRPads, InspectionComment, roNum) => {
    const checkresult = await runQuery('SELECT RO_ID FROM Inspection WHERE RO_ID = $1', [roNum]).catch((err) => console.log(err));
    if (checkresult.rows.length != 0) {
        await runQuery(updateInspectionQuery, [parseFloat(LFPres), parseFloat(RFPres), parseFloat(LRPres), parseFloat(RRPres), parseFloat(SparePres), parseFloat(LFTread), 
            parseFloat(RFTread), parseFloat(LRTread), parseFloat(RRTread), parseFloat(SpareTread), parseFloat(LFPads), parseFloat(RFPads), parseFloat(LRPads), parseFloat(RRPads), 
            InspectionComment, parseInt(roNum)])
        
        const list = await selectInspection(roNum).catch((err) => console.log(err))
        return list[0]
    } else {
        await runQuery(insertInspectionQuery, [parseFloat(LFPres), parseFloat(RFPres), parseFloat(LRPres), parseFloat(RRPres), parseFloat(SparePres), parseFloat(LFTread), 
            parseFloat(RFTread), parseFloat(LRTread), parseFloat(RRTread), parseFloat(SpareTread), parseFloat(LFPads), parseFloat(RFPads), parseFloat(LRPads), parseFloat(RRPads), 
            InspectionComment, parseInt(roNum)])
        
        const list = await selectInspection(roNum).catch((err) => console.log(err))
        return list[0]
    }
}

const selectInspection = async (roNum) => {
    result = await runQuery(selectInspectionQuery, [parseInt(roNum)]).catch((err) => console.log(err))
    return result.rows
}

const selectInspection_init = async (roNum) => {
    const checkresult = await runQuery('SELECT RO_ID FROM Inspection WHERE RO_ID = $1', [roNum]).catch((err) => console.log(err));
    if (checkresult.rows.length != 0) {
        const list = await selectInspection(roNum).catch((err) => console.log(err))
        return list
    } else {
        return checkresult.rows
    }

}





module.exports = {
    insertInspection,
    selectInspection,
    selectInspection_init
}

var insertInspectionQuery = 'INSERT INTO Inspection (LFPres, RFPres, LRPres, RRPres, SparePres, LFTread, RFTread, LRTread, RRTread, SpareTread, LFPads, RFPads, LRPads, RRPads, InspectionComment, RO_ID)' + 
                        ' VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING Inspection_ID ';


var updateInspectionQuery = 'UPDATE Inspection SET LFPres = $1, RFPres = $2, LRPres = $3, RRPres = $4,' +
                            'SparePres = $5, LFTread = $6, RFTread = $7, LRTread = $8, RRTread = $9, SpareTread = $10,' + 
                            'LFPads = $11, RFPads = $12, LRPads = $13, RRPads = $14, InspectionComment = $15' +
                            'WHERE RO_ID = $16 RETURNING Inspection_ID';   
                                     


var selectInspectionQuery = 'SELECT * FROM Inspection WHERE RO_ID = $1'; 

