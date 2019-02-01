/**
 * Created by japjohal on 2018-10-05.
 */

var express = require('express');
var router = express.Router();
const pg = require('pg');


// Init the other DB file
var dbFunc = require("./createRepairOrderSec1");
const checkVin          = require("../routes/checkVIN");

router.post("/insertCustomer",function (req,resp) {

    doInsertsNewCustomerNewVehicle(req).then(data => {
        if(data == null){
            resp.send({
                status:1
            })
        }
        resp.send(data)
    });
});

router.post("/insertOldCustNewVehicle", function(req,resp) {
    doInsertOldCustomerNewVehicle(req)
        .then(respp => {
            resp.send(respp);
        })
})

router.post("/insertOldCustomerOldVehicle",function (req,resp) {
   doInsertOldCustomerOldVehicle(req)
       .then(response => resp.send(response))
})

router.post("/vinCheck", function (req,resp) {
    doDbCheck(req.body.vinNum)
        .then(result => {
            console.log(result);
            resp.send({
                result:result.result,
                errorCode:0
            });
        })
        .catch(err => {
            resp.send({
                errorCode:1,
                errorMessage:err.code
            });
        })

})

async function doDbCheck(vin) {
    let vinResult = await checkVin.checkVIN(vin);
    return vinResult;
}

async function doInsertOldCustomerNewVehicle(req) {
    dbFunc.connectToPool();
    const insertVehicleInfo = await dbFunc.insertVehicles([req.body.dataGram, {cust_id:req.body.customerId}, req.body.date]).catch(err =>console.log(err));
    const createRepairOrder = await dbFunc.createRepairOrder([req.body.dataGram, insertVehicleInfo, req.body.date]);

    if (req.body.requests.otherReqTotal == 0) {
        // if there are only commonWorkTasks create entries in repair order
        return await insertWithOnlyCommonTasks(req.body.requests.commonRequests, createRepairOrder);
    }
    else {

        if (req.body.requests.commonRequestsTotal != 0) {
            // if there are common and uncommon work tasks insert them to DB
            return (insertCommonUnCommonWorkTasks(req, createRepairOrder))
        }
        else {
            // if there are only unCommon work tasks come here
            return (insertOnlyUnCommonWorkTasks(req, createRepairOrder))
        }
    }
}

async function doInsertsNewCustomerNewVehicle(req) {
    try{
        dbFunc.connectToPool()
        // these are necessary under all circumstances
        const insertCustomerInfo = await dbFunc.insertCustomer(req);
        const insertVehicleInfo = await dbFunc.insertVehicles([req.body.dataGram, insertCustomerInfo.customerID, req.body.date])
        const createRepairOrder = await dbFunc.createRepairOrder([req.body.dataGram, insertVehicleInfo,req.body.date]);
        // we are adding rows to the repair order based on what info is passed to us
        // Basically on first IF we are going there if their arent any otherServiceReq
        // then second IF is if we have unCommonReq and some commonRequests
        // second else we go there if and only if we have only otherServiceRequests

        if (req.body.requests.otherReqTotal == 0) {
            // if there are only commonWorkTasks create entries in repair order
            return await insertWithOnlyCommonTasks(req.body.requests.commonRequests, createRepairOrder);
        }
        else {

            if (req.body.requests.commonRequestsTotal != 0) {
                // if there are common and uncommon work tasks insert them to DB
                return insertCommonUnCommonWorkTasks(req, createRepairOrder)
            }
            else {
                // if there are only unCommon work tasks come here
                return insertOnlyUnCommonWorkTasks(req, createRepairOrder)

            }
        }
    }
    catch (Exception) {
        console.log(Exception);
        dbFunc.closeDBConnection();
        return null;
    }
}

async function doInsertOldCustomerOldVehicle(req) {

    try{
        dbFunc.connectToPool()
        // these are necessary under all circumstances
        const createRepairOrder = await dbFunc.createRepairOrder([req.body.dataGram,{vehicleID:req.body.vehicleId},req.body.date]);
        // we are adding rows to the repair order based on what info is passed to us
        // Basically on first IF we are going there if their arent any otherServiceReq
        // then second IF is if we have unCommonReq and some commonRequests
        // second else we go there if and only if we have only otherServiceRequests

        if (req.body.requests.otherReqTotal == 0) {
            // if there are only commonWorkTasks create entries in repair order
            return await insertWithOnlyCommonTasks(req.body.requests.commonRequests, createRepairOrder);
        }
        else {

            if (req.body.requests.commonRequestsTotal != 0) {
                // if there are common and uncommon work tasks insert them to DB
                return insertCommonUnCommonWorkTasks(req, createRepairOrder)
            }
            else {
                // if there are only unCommon work tasks come here
                return insertOnlyUnCommonWorkTasks(req, createRepairOrder)

            }
        }
    }
    catch (Exception) {
        console.log(Exception);
        dbFunc.closeDBConnection();
        return null;
    }
}











async function insertWithOnlyCommonTasks(commonTasks,createRepairOrder){
    const createWorkTasksCommon = await dbFunc.createWorkTaskCommon(commonTasks, createRepairOrder);
    const testMethod = await dbFunc.getInfo(createWorkTasksCommon);
    dbFunc.closeDBConnection();
    return await testMethod;
}

async function insertCommonUnCommonWorkTasks(req, createRepairOrder) {
    let insertUnCommonWorkTaskGetIDs;
    insertUnCommonWorkTaskGetIDs = await dbFunc.insertUnCommonTasks(req.body);
    const insertUnCommonTasksToWorkTaskIDs = await dbFunc.createWorkTaskUnCommon(insertUnCommonWorkTaskGetIDs, createRepairOrder);
    const insertCommonTasksToWorkTaskIDs = await dbFunc.createWorkTaskCommon(req.body.requests.commonRequests, createRepairOrder);
    const testMethod = await dbFunc.getInfo(insertUnCommonTasksToWorkTaskIDs);
    const testMethod2 = await dbFunc.getInfo(insertCommonTasksToWorkTaskIDs);
    dbFunc.closeDBConnection();
    return await [testMethod, testMethod2];
}

async function insertOnlyUnCommonWorkTasks(req, createRepairOrder) {
    let insertUnCommonWorkTasksToTasksTable;
    insertUnCommonWorkTasksToTasksTable = await dbFunc.insertUnCommonTasks(req.body);
    const insertUnCommonTasksToWorkTaskToWorkTaskTable = await dbFunc.createWorkTaskUnCommon(insertUnCommonWorkTasksToTasksTable, createRepairOrder);
    const testMethod = await dbFunc.getInfo(insertUnCommonTasksToWorkTaskToWorkTaskTable);
    dbFunc.closeDBConnection();
    return await testMethod;
}

module.exports = router;