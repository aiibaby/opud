/**
 * Created by japjohal on 2018-10-12.
 * this is going to be the scenario where you create a work order based on a new customer and new vehicle
 * using prepared statements to make DB queries cleaner
 */

const { Pool, Client } = require('pg')

const config = {
    user: 'postgres',
    database: 'sot',
    password: 'password',
    port: 5432
};

let pool;

function connectToPool() {
    pool  = new Pool(config)

}

function closeDBConnection() {
    pool.end();
}

var insertCustomer = (req) => {
    return new Promise((resolve, reject) => {


        var data = [req.body.firstName, req.body.lastName, req.body.homePhone, req.body.cellPhone, req.body.street, req.body.city, req.body.postalCode, req.body.date];
        const query = {
            // give the query a unique name
            name: 'insertCustomer',
            text: insertCustomerQuery,
            values: data
        };

        pool.query(query)
            .then(result => resolve({customerID: result.rows[0]}))
            .catch(err => reject(err))

    })
}

var insertVehicles = (info) => {
    return new Promise((resolve, reject) => {
        const query = {
            // give the query a unique name
            name: 'insertVehicle',
            text: insetVehicleQuery,
            values: [info[0].vin, parseInt(info[0].year), info[0].license, info[0].make, info[0].model, info[0].color, info[2], info[1].cust_id]
        };

        pool.query(query)
            .then(result => resolve({vehicleID: result.rows[0].vehicle_id}))
            .catch(err => reject(err))
    })
}

var insertUnCommonTasks = (info) => {
    return new Promise((resolve, reject) => {

        var variablesNeeded = [];
        for (var i = 0; i < info.requests.otherReqTotal; i++) {
            variablesNeeded.push('($' + (i + 1) + ')');
        }
        const query = {
            // give the query a unique name
            name: 'insertUnCommonTasks',
            text: 'INSERT INTO task (task_name) VALUES' + variablesNeeded.join(",") + 'returning task_id',
            values: info.requests.otherRequests
        };
        pool.query(query)
            .then(result => resolve(result.rows))
            .catch(err => reject(err))
    })
}


var createRepairOrder = (dataGram) =>{
    return new Promise((resolve,reject) =>{
        var repairOrderData = [dataGram[0].vehicleNotes, parseFloat(dataGram[0].odometer), dataGram[2],dataGram[1].vehicleID,dataGram[0].datePromised];

        pool.connect((err, client, done)=> {
            if (err) {
                console.log("Error in work vehicle");
                reject({status:0})
            }

            client.query('INSERT INTO repair_order (vehicle_notes, odometer_in, date_in , vehicle_id, promised_time) VALUES($1, $2, $3, $4, $5) returning RO_ID',repairOrderData,
                (err, result)=>{
                    done();
                    if (err) {
                        console.log("Error in work order entry function");
                        reject(err)
                    }
                    else {
                        resolve(result.rows[0]);
                    }
                }
            )
        })
    })
}

var createWorkTaskUnCommon = (unCommonTasksID, repairOrderId) => {
    return new Promise((resolve, reject) => {

        let arr = [];

        for (let i = 0; i < unCommonTasksID.length; i++) {

            const query = {
                // give the query a unique name
                name: 'createRepairOrder',
                text: 'INSERT INTO repair_tasks (RO_ID, Task_id) VALUES ($1, $2) returning worktask_id',
                values: [repairOrderId.ro_id, unCommonTasksID[i].task_id]
            };
            pool.query(query)
                .then(res => {
                    arr.push(res.rows[0]);
                    if (i == (unCommonTasksID.length - 1)) {
                        resolve(arr);
                    }
                })
                .catch(err => reject(err))
        }

    })
}

var createWorkTaskCommon = (unCommonTasksID, repairOrderId) => {
    return new Promise((resolve, reject) => {

        let arr = [];

        for (let i = 0; i < unCommonTasksID.length; i++) {

            const query = {
                // give the query a unique name
                name: 'createRepairOrder',
                text: 'INSERT INTO repair_tasks (RO_ID, Task_id) VALUES ($1, $2) returning worktask_id',
                values: [repairOrderId.ro_id, unCommonTasksID[i]]
            };
            pool.query(query)
                .then(res => {
                    arr.push(res.rows[0]);
                    if (i == (unCommonTasksID.length - 1)) {
                        resolve(arr);
                    }
                })
                .catch(err => reject(err))
        }

    })
};



var getInfo =(taskID) =>{
    return new Promise((resolve, reject) => {

        let array = [];
        for (let i = 0; i < taskID.length; i++) {
            const query = {
                // give the query a unique name
                name: 'checkInfoValidation',
                text: selectQuery,
                values: [taskID[i].worktask_id]
            };
            pool.query(query)
                .then(res => {
                    if(i != (taskID.length - 1)){
                        array.push(res.rows[0]);
                    }
                    else{
                        array.push(res.rows[0]);
                        resolve(array);

                    }
                })
                .catch(err => reject(err))
        }
    })

}




var insertCustomerQuery = 'INSERT INTO customer (first_name, last_name, home_phone, cell_phone, street, city, postal_code, date_added)' +
    'VALUES ($1,$2,$3,$4,$5,$6,$7,$8) returning cust_id';

var insetVehicleQuery = 'INSERT INTO vehicle (vin, year, license_plate, make, model, color, date_added, cust_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) returning vehicle_id ';

var selectQuery = "Select repair_tasks.RO_ID as RepairOrderID," +
                    "repair_tasks.Task_ID as taskID, task.task_name as taskName," +
                    "repair_order.vehicle_id as vehicleID, vehicle.make, vehicle.model, vehicle.year," +
                    "vehicle.cust_id as customerID, customer.first_name as firstName, customer.last_name as lastName, customer.home_phone as Phone, customer.city as City " +
                    "from repair_tasks " +
                        "RIGHT JOIN repair_order ON (repair_order.RO_ID      = repair_tasks.RO_ID)" +
                        "RIGHT JOIN vehicle      ON (repair_order.vehicle_id = vehicle.vehicle_id)" +
                        "RIGHT JOIN customer     ON (vehicle.cust_id         = customer.cust_id)" +
                        "RIGHT JOIN task         ON (task.Task_ID            = repair_tasks.Task_ID)" +
                        "where repair_tasks.worktask_id=$1";


module.exports = {
    insertCustomer,
    insertVehicles,
    insertUnCommonTasks,
    createRepairOrder,
    createWorkTaskUnCommon,
    getInfo,
    createWorkTaskCommon,
    closeDBConnection,
    connectToPool
};
