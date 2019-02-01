$(document).ready(function() {
    
    
    // user search input and parameters
    var roSearchInp = document.getElementById("roSearchInp");
    var SOptionsDropdown = document.getElementById("SOptionsDropdown");
    var ROOptionsDropdown = document.getElementById("ROOptionsDropdown");
    
    // buttons
    var searchROBut = document.getElementById("searchROBut");
    var popupClose = document.getElementById("popupClose");
    var editRO = document.getElementById("editRO");
    var saveRO = document.getElementById("saveRO");
    
    // repair order popup
    var roPopup = document.getElementById("roPopup");
    var popupContent = document.getElementById("popupContent");
    var popupClose = document.getElementsByClassName("close")[0];
    var roContainer = document.getElementById("roContainer");
    
    // repair order fields
    var roNum = document.getElementById("roNum");
    var roCustName = document.getElementById("roCustName");
    var roTel = document.getElementById("roTel");
    var roCell = document.getElementById("roCell");
    var roVIN = document.getElementById("roVIN");
    var roLicense = document.getElementById("roLicense");
    var roYear = document.getElementById("roYear");
    var roMake = document.getElementById("roMake");
    var roModel = document.getElementById("roModel");
    var roOdometerIn = document.getElementById("roOdometerIn");
    var roOdometerOut = document.getElementById("roOdometerOut");
    var roNotes = document.getElementById("roNotes");
    
    // repair order updatable fields
    var roTask = document.getElementById("roTask");
    var odometerOut= document.getElementById("odometerOut");
    var promiseDate = document.getElementById("promiseDate");
    var openclose = document.getElementById("openclose");
    
    // print repair order
    var openPDF = document.getElementById("openPDF");
    var vehicle_info = null;
    
    
    
    // this function populates the DataTable with the returned query result
    searchROBut.onclick = function() {
        $.ajax({
            url:"/rosearch/AroSearch",
            type:"post",
            data:{
                roSearchWord:roSearchInp.value,
                roSearchBy:SOptionsDropdown.value,
                roStatus:ROOptionsDropdown.value,  
            },
            success:function(data){
                if (data){
                    
                if ( $.fn.DataTable.isDataTable('#resultsTable') ) {
                    $('#resultsTable').DataTable().destroy();
                }
                
                // var is not defined for resultsTable as it will cause a bug where the datatable will not read the data correctly 
                resultsTable = $('#resultsTable').DataTable({
                    //destroy: true,
                    select: true,
                    data: data,
                    "autoWidth": false,
                    "columns": [
                        {"data":"ro_id"},
                        {"data":"last_name"},
                        {"data":"first_name"},
                        {"data":"license_plate"},
                        {"data":"make"},
                        {"data":"model"},
                        {data:"status",
                          render : function (data, type, row) {
                             return data == 'true' ? 'Closed' : 'Open'
                          }
                        }
                    ]
                    
                });
                 
                // this function display a popup screen that display relevant repair order information
                resultsTable.on('select', function ( e, dt, type, indexes ) {
                    
                    var rowData = resultsTable.rows( indexes ).data()[0];
                    //console.log(rowData);
                    disableInputs();
                    vehicle_info = rowData;
                    populateRO(rowData);
                    searchTask(rowData.ro_id, rowData);   
                });

                  
                }
                else{
                    alert("Error! taskSearch");
                }
            }  
        });
    }
    
    
    openPDF.onclick = function(){
        $.ajax({
            url: "/print/createPrint",
            type: "post",
            data: vehicle_info,
            success: function(data){
                //window.location = "/print";
                window.open("/print");
            }
        });
    }
    
    // this function populates the popup repair order screen with the selected repair order information
    function populateRO(rowData){
        roPopup.style.display = "block";
        roNum.innerHTML = rowData.ro_id;
        roCustName.innerHTML = rowData.last_name + ", " + rowData.first_name;
        roTel.innerHTML = rowData.home_phone;
        roCell.innerHTML = rowData.cell_phone;
        roVIN.innerHTML = rowData.vin;
        roLicense.innerHTML = rowData.license_plate;
        roMake.innerHTML = rowData.make;
        roModel.innerHTML = rowData.model;
        roYear.innerHTML = rowData.year;
        roOdometerIn.innerHTML = rowData.odometer_in;
        odometerOut.value = rowData.odometer_out;
        roNotes.innerHTML = rowData.vehicle_notes;
        openclose.value = rowData.status;

        var promiseData = new Date(rowData.promised_time);
        promiseDate.innerHTML = promiseData.getFullYear() + '-' + promiseData.getMonth() + '-' + promiseData.getDate() + ' ' + promiseData.getHours() + ':' + (promiseData.getMinutes()<10?'0':'') +  promiseData.getMinutes();
    }
    
    
    // ajax that sends the (ro_id) to get all the service requested information (worktask_id, comments, task_name)
    function searchTask(roID, rowData){
        $.ajax({
            url:"/rosearch/taskSearch",
            type:"post",
            data:{
                roID:roID
            },
            success:function(data){
            if (data){
                vehicle_info['tasks_info'] = data;
                roTask.innerHTML="";

                // populates tasks and comments for the repair order
                populateTasksComments(data);

                // enable input fields when the editRO button is clicked
                editRO.onclick = function(){
                        enableInputs(data);
                }

                // disabled input fields when the saveRO button is click, save the input field values into the database
                saveRO.onclick = function(){
                    disableInputs();
                    saveComments(data);
                    updateRO(saveComments(data), odometerOut.value, rowData.ro_id, openclose.value);
                    
                    
                }                        

                }

            }
        }); 
    }
    
    
    // this function populates the tasks and comments for each repair order 
    function populateTasksComments(data){
        for(var i = 0; i<data.length; i++){
            var task_id = data[i].worktask_id;
            var comment = data[i].comments;
            var taskName = data[i].task_name; 
            var taskEntry = document.createElement('li');
            var editTask = document.createElement("textarea");
            editTask.className = 'form-control';
            editTask.id = 'comments' + data[i].worktask_id;
            editTask.disabled = true;
            editTask.rows = '5';
            editTask.style.marginBottom = '10px';

            if(comment == null){
                editTask.value = "";
            }else{
                editTask.value = comment;
            }
            /*
            //Add Parts Button -- currently not implemented
            var addPartBut = document.createElement("button");
            addPartBut.className = "btn btn-default";
            addPartBut.innerHTML = "Add Part";
            addPartBut.style.marginBottom = "15px";
            //addPartBut.id = task_id;
            addPartBut.onclick = function(task_id){
                return function(){
                    addPartButFunc(task_id);
                };
            }(task_id);
            */
            taskEntry.appendChild(document.createTextNode(taskName));

            var taskDiv = document.createElement("div");

            taskDiv.appendChild(taskEntry);
            taskDiv.appendChild(editTask);
            
            //Add Parts Button -- currently not implemented
            //taskDiv.appendChild(addPartBut);
            
            taskDiv.id = "taskNum"+task_id;
            roTask.appendChild(taskDiv);
        }
    }
    
    
    // function to save the comments textarea fields into an array and disable the comment textarea fields
    function saveComments(data){
        var array = [{}];
        
        for(var k = 0; k<data.length; k++){
            document.getElementById('comments' + data[k].worktask_id).disabled = true;

            array.push({
                'worktask_id': data[k].worktask_id,
                'comments': (document.getElementById('comments' + data[k].worktask_id).value)
            })

        }
        return array;
    }
    
    // ajax to send the input field values
    function updateRO(worktaskIDcomments, odometerOut, roID, openClose){
        $.ajax({
            url:"/rosearch/updateRO",
            type:"post",
            data:{
                worktaskIDComments:worktaskIDcomments,
                odometerOut:(odometerOut),
                roID:roID,
                openClose:(openClose)
            },
            success:function(data){
                if (data){
                    console.log(data);
                    window.location.reload(); 
                }
            }
         });
    }
    
    // this function disable the updatable input fields 
    function disableInputs(){
        saveRO.className = "btn btn-default pull-right invisible";
        editRO.className = "btn btn-default pull-right visible";
        odometerOut.disabled = true;
        openclose.disabled = true;
        openclose.style.backgroundColor = "#eee";
    }
    
    // this function enable the updatable input fields
    function enableInputs(data){
        
        for(var j = 0; j<data.length; j++){
            document.getElementById('comments' + data[j].worktask_id).disabled = false;
        }
        
        saveRO.className = "btn btn-default pull-right visible";
        editRO.className = "btn btn-default pull-right invisible";
        odometerOut.disabled = false;
        openclose.disabled = false;
        openclose.style.backgroundColor = "#fff";
    }
    
    // this funtion creates the parts inputs 
    function addPartButFunc(worktask_id){
        //console.log("Task id: "+worktask_id);
        var partsDiv = document.createElement("div");
        partsDiv.className = "row";
        partsDiv.style.marginBottom = "15px";
        var partNoInp = document.createElement("input");
        partNoInp.className = "col-sm-2";
        partNoInp.placeholder = "Part Number";
        //partNoInp.id = "partNoInp"
        var partDescInp = document.createElement("input");
        partDescInp.className = "col-sm-2";
        partDescInp.placeholder = "Description";
        var partQtyInp = document.createElement("input");
        partQtyInp.className = "col-sm-2";
        partQtyInp.placeholder = "Quantity";
        var partUnitPriceInp = document.createElement("input");
        partUnitPriceInp.className = "col-sm-2";
        partUnitPriceInp.placeholder = "Unit Price";
        var partSellPriceInp = document.createElement("input");
        partSellPriceInp.className = "col-sm-2";
        partSellPriceInp.placeholder = "Sell Price"
        var partSupplierNameInp = document.createElement("input");
        partSupplierNameInp.className = "col-sm-2";
        partSupplierNameInp.placeholder = "Supplier"
        
        partsDiv.appendChild(partNoInp);
        partsDiv.appendChild(partDescInp);
        partsDiv.appendChild(partQtyInp);
        partsDiv.appendChild(partUnitPriceInp);
        partsDiv.appendChild(partSellPriceInp);
        partsDiv.appendChild(partSupplierNameInp);
        
        document.getElementById("taskNum"+worktask_id).appendChild(partsDiv);
    }
    
    
    // this function closes the repair order popup when 'x' is clicked
    
    function closePopup(){
        roPopup.style.display = "none";
        roTask.innerHTML="";
    }
    
    popupClose.onclick = function() {
        closePopup();
    }
  
    
    // this function closes the repair order popup when the gray area is clicked 
    window.onclick = function(event) {
        if (event.target == roContainer) {
            roPopup.style.display = "none";
            roTask.innerHTML="";
    }
        
    // This function prevents refreshes on enter on #roSearchInp
    $(window).keydown(function(event){
       if(event.keyCode == 13) {
         event.preventDefault();
         return false;
       }
   });
}
});