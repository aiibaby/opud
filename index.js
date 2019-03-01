/**
 * ToDo: Package data from other requests and send to DB, need to set up promises for data
 */

const exp = require("express");
const port = process.env.PORT || 10000;
const path = require("path");
const bodyParser = require("body-parser");
const expressSession = require("express-session");


// had to change button Id of second add button for the other request option

//defining routed function files -Homy
const seaFunctions = require('./routes/searchFunctions.js');
const vinFunctions = require('./routes/checkVIN.js');
var dbFunctions = require("./routes/dbFunctions");
var roFunctions = require("./routes/roFunctions");
const auth = require("./routes/loginCheck");
const inspectionFunctions = require("./routes/createInspection.js")

//const pdfFunctions = require("./pdf/repordpdf")
const printableFunctions = require('./routes/printableFunctions.js');

var pF = path.resolve(__dirname, "public");
var app = exp();

//create a new server for socket, but combine it with express functions
const server = require("http").createServer(app);


app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(expressSession({
    secret:"HIGJLCPJOPUD",
    resave: true,
    saveUninitialized:true
}));

app.use("/scripts", exp.static("build"));
app.use("/css", exp.static("style"));
app.use("/pages",exp.static("public"));
app.use("/dependencies",exp.static("src"))

app.use(bodyParser.urlencoded({
    extended:true
}));

app.get("/", function(req, resp){
    resp.sendFile(pF+"/checkin.html")
});
app.get("/orders", function(req, resp){
    resp.sendFile(pF+"/ro.html")
});
app.get("/print", function(req, resp){
    resp.sendFile(pF+"/roprint.html")
});
app.get("/printInvoice", function(req, resp){
    resp.sendFile(pF+"/roprint.html")
});
app.get("/test", function(req, resp){
    resp.sendFile(pF+"/order.html")
});

app.get("/about", function(req,resp){
    resp.sendFile(pF+"/about.html")
});

app.get("/login", function(req,resp){
    resp.sendFile(pF+"/login.html")
});


app.use("/data",dbFunctions);
app.use("/rosearch", roFunctions);
//app.use("/pdf", pdfFunctions)
app.use("/print", printableFunctions);

//search function from Glenn
app.post("/search", (request,response)=>{
	seaFunctions.getSearchData(request.body.searchQuery, request.body.searchType).then((result)=>{
		response.send(result);
	}).catch((result)=>{
        response.send(result);
    });
});
app.post("/order", (req,res)=>{
    inspectionFunctions.selectInspection_init(req.body.roNum)
    .then((result) => {
        if (result.length != 0) {
            result = result[0]
            res.render(pF+"/order.hbs",{
                roNum: req.body.roNum,
                roCustName: req.body.roCustName,
                roTel: req.body.roTel,
                roCell: req.body.roCell,
                roVIN: req.body.roVIN,
                roMake: req.body.roMake,
                roYear: req.body.roYear,
                roLicense: req.body.roLicense,
                roModel: req.body.roModel,
                roOdometerIn: req.body.roOdometerIn,
                odometerOut: req.body.odometerOut,
                roNotes: req.body.roNotes,
                openclose: req.body.openclose,
                promiseDate: req.body.promiseDate,
                LFPres: result.lfpres,
                RFPres: result.rfpres,
                LRPres: result.lrpres,
                RRPres: result.rrpres,
                SparePres: result.sparepres,
                LFTread: result.lftread,
                RFTread: result.rftread,
                LRTread: result.lrtread,
                RRTread: result.rrtread,
                SpareTread: result.sparetread,
                LFPads: result.lfpads,
                RFPads: result.rfpads,
                LRPads: result.lrpads,
                RRPads: result.rrpads,
                InspectionComment: result.inspectioncomment, 
            })
        } else {
            res.render(pF+"/order.hbs",{
                roNum: req.body.roNum,
                roCustName: req.body.roCustName,
                roTel: req.body.roTel,
                roCell: req.body.roCell,
                roVIN: req.body.roVIN,
                roMake: req.body.roMake,
                roYear: req.body.roYear,
                roLicense: req.body.roLicense,
                roModel: req.body.roModel,
                roOdometerIn: req.body.roOdometerIn,
                odometerOut: req.body.odometerOut,
                roNotes: req.body.roNotes,
                openclose: req.body.openclose,
                promiseDate: req.body.promiseDate,
                LFPres: "",
                RFPres: "",
                LRPres: "",
                RRPres: "",
                SparePres: "",
                LFTread: "",
                RFTread: "",
                LRTread: "",
                RRTread: "",
                SpareTread: "",
                LFPads: "",
                RFPads: "",
                LRPads: "",
                RRPads: "",
                InspectionComment: "", 
            })
        }
              
	})
});

app.post("/inspection", (req,res)=> {
    inspectionFunctions.selectInspection_init(req.body.roNum)
    .then((result) => {
        if (result.length != 0) {
            result = result[0]
            res.render(pF+"/inspection.hbs",{
                roNum: req.body.roNum,
                roCustName: req.body.roCustName,
                roTel: req.body.roTel,
                roCell: req.body.roCell,
                roVIN: req.body.roVIN,
                roMake: req.body.roMake,
                roYear: req.body.roYear,
                roLicense: req.body.roLicense,
                roModel: req.body.roModel,
                roOdometerIn: req.body.roOdometerIn,
                odometerOut: req.body.odometerOut,
                roNotes: req.body.roNotes,
                openclose: req.body.openclose,
                promiseDate: req.body.promiseDate,
                LFPres: result.lfpres,
                RFPres: result.rfpres,
                LRPres: result.lrpres,
                RRPres: result.rrpres,
                SparePres: result.sparepres,
                LFTread: result.lftread,
                RFTread: result.rftread,
                LRTread: result.lrtread,
                RRTread: result.rrtread,
                SpareTread: result.sparetread,
                LFPads: result.lfpads,
                RFPads: result.rfpads,
                LRPads: result.lrpads,
                RRPads: result.rrpads,
                InspectionComment: result.inspectioncomment, 
            })
        } else {
            res.render(pF+"/inspection.hbs",{
                roNum: req.body.roNum,
                roCustName: req.body.roCustName,
                roTel: req.body.roTel,
                roCell: req.body.roCell,
                roVIN: req.body.roVIN,
                roMake: req.body.roMake,
                roYear: req.body.roYear,
                roLicense: req.body.roLicense,
                roModel: req.body.roModel,
                roOdometerIn: req.body.roOdometerIn,
                odometerOut: req.body.odometerOut,
                roNotes: req.body.roNotes,
                openclose: req.body.openclose,
                promiseDate: req.body.promiseDate,
                LFPres: "",
                RFPres: "",
                LRPres: "",
                RRPres: "",
                SparePres: "",
                LFTread: "",
                RFTread: "",
                LRTread: "",
                RRTread: "",
                SpareTread: "",
                LFPads: "",
                RFPads: "",
                LRPads: "",
                RRPads: "",
                InspectionComment: "", 
            })
        }
    })
})

app.post("/inspectionSave", (req,res)=> {
    inspectionFunctions.insertInspection(req.body.LFPres,req.body.RFPres,req.body.RFPres,req.body.RRPres,
        req.body.SparePres,req.body.LFTread, req.body.RFTread, req.body.LRTread, req.body.RRTread, 
        req.body.SpareTread, req.body.LFPads,
        req.body.RFPads, req.body.LRPads, req.body.RRPads, req.body.InspectionComment, req.body.roNum)
        .then((result) => {
            res.render(pF+"/order.hbs",{
                roNum: req.body.roNum,
                roCustName: req.body.roCustName,
                roTel: req.body.roTel,
                roCell: req.body.roCell,
                roVIN: req.body.roVIN,
                roMake: req.body.roMake,
                roYear: req.body.roYear,
                roLicense: req.body.roLicense,
                roModel: req.body.roModel,
                roOdometerIn: req.body.roOdometerIn,
                odometerOut: req.body.odometerOut,
                roNotes: req.body.roNotes,
                openclose: req.body.openclose,
                promiseDate: req.body.promiseDate,  
                LFPres: result.lfpres,
                RFPres: result.rfpres,
                LRPres: result.lrpres,
                RRPres: result.rrpres,
                SparePres: result.sparepres,
                LFTread: result.lftread,
                RFTread: result.rftread,
                LRTread: result.lrtread,
                RRTread: result.rrtread,
                SpareTread: result.sparetread,
                LFPads: result.lfpads,
                RFPads: result.rfpads,
                LRPads: result.lrpads,
                RRPads: result.rrpads,
                InspectionComment: result.inspectioncomment,      
            });
        }).catch((err) => {
            console.log(err)
        })
    
})

app.post("/inspectionCancel", (req,res)=> {
    inspectionFunctions.selectInspection(req.body.roNum)
    .then((result) => {
        result = result[0]
        res.render(pF+"/order.hbs",{
            roNum: req.body.roNum,
            roCustName: req.body.roCustName,
            roTel: req.body.roTel,
            roCell: req.body.roCell,
            roVIN: req.body.roVIN,
            roMake: req.body.roMake,
            roYear: req.body.roYear,
            roLicense: req.body.roLicense,
            roModel: req.body.roModel,
            roOdometerIn: req.body.roOdometerIn,
            odometerOut: req.body.odometerOut,
            roNotes: req.body.roNotes,
            openclose: req.body.openclose,
            promiseDate: req.body.promiseDate,
            LFPres: result.lfpres,
            RFPres: result.rfpres,
            LRPres: result.lrpres,
            RRPres: result.rrpres,
            SparePres: result.sparepres,
            LFTread: result.lftread,
            RFTread: result.rftread,
            LRTread: result.lrtread,
            RRTread: result.rrtread,
            SpareTread: result.sparetread,
            LFPads: result.lfpads,
            RFPads: result.rfpads,
            LRPads: result.lrpads,
            RRPads: result.rrpads,
            InspectionComment: result.inspectioncomment,      
        });
    });
   

})

app.post("/cVIN", (request,response)=>{
	vinFunctions.checkVIN(request.body.vin).then((result)=>{
		response.send(result);
	}).catch((result)=>{
        response.send(result);
    });
});

app.post('/login', (request, response) => {
    auth.login(request.body.id, request.body.password)
        .then(() => {
            response.redirect('/')
        }).catch((err) => {
            console.log(err)
        })
});

app.post("/setVariables",function (req,resp) {
    //req.session.status in index.js determines the scenario:
    //Status 0: New Customer, New Vehicle
    //Status 1: Old Customer, New Vehicle
    //Status 2: Old Customer, Old Vehicle
    console.log(req.body);
    req.session.status = req.body.status;
    req.session.vehicle_id = req.body.vehicle_id;
    req.session.cust_id = req.body.cust_id;
    console.log(req.session.status, req.session.vehicle_id, req.session.cust_id);
    resp.send({
        status: req.session.status,
        vehicle_id : req.session.vehicle_id,
        cust_id : req.session.cust_id
    });
})

app.post("/getVariables",function (req,resp) {
    resp.send({
        status: req.session.status,
        cust_id: req.session.cust_id,
        vehicle_id: req.session.vehicle_id
    });
})

server.listen(10000, function(err){
    if(err){
        console.log(err);
        return false;
    }
    
    console.log(port+" is running");
});


/*app.get("/menu", function(req, resp){
    resp.sendFile(pF+"/menu.html")
});
*/


