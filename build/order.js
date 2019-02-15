$(document).ready(function() {
    // user search input and parameters
    
    // buttons
    var editRO = document.getElementById("editRO");
    var saveRO = document.getElementById("saveRO");
    
    // repair order popup
    var roPopup = document.getElementById("roPopup");
    var popupContent = document.getElementById("popupContent");
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
    var openInvoice = document.getElementById("openInvoice");
    var vehicle_info = null;
    
    
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

    openInvoice.onclick = function(){
        $.ajax({
            url: "/print/createPrint",
            type: "post",
            data: vehicle_info,
            success: function(data){
                //window.location = "/print";
                window.open("/printInvoice");
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
    function searchTask(roID){
        $.ajax({
            url:"/rosearch/taskSearch",
            type:"post",
            data:{
                roID:roID
            },
            success:function(data){
            if (data){
                console.log(data)
                vehicle_info = data;
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
                    updateRO(saveComments(data), odometerOut.value, roID, openclose.value);
                    }                        
                }
            }
        }); 
    }
    searchTask(roNum.innerHTML)
    disableInputs()
    
    
    // this function populates the tasks and comments for each repair order 
    function populateTasksComments(data){
        for(var i = 0; i<data.length; i++){
            var task_id = data[i].worktask_id;
            var comment = data[i].comments;
            var taskName = data[i].task_name; 
            var taskEntry = document.createElement('li');
            var editTask = document.createElement("textarea");
            var newDiv = document.createElement("div");
            newDiv.className = 'row'
            taskEntry.className = 'pull-left col-sm-6'
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
            //add part header
            var partHead = document.createElement('div');
            partHead.className = 'col-2 ml-auto';
            partHead.style.marginBottom = '5px';
            partHead.style.marginTop = '5px';
            partHead.innerHTML = "<b>Part Section</b>";
            var partBut = document.createElement("button");
            partBut.className = 'col-10 ml-auto but';
            partBut.id = `PBut${i}`
            partBut.style.display = 'none';
            partBut.style.left = '12vw';
            partBut.style.marginBottom = '10px';
            partBut.style.marginTop = '-30px';
            partBut.style.position = 'relative';
            partBut.innerHTML = 'Add Part'
            //add parts table
            var div1 = document.createElement('div');
            var partTable = document.createElement('table');
            var ptHead = document.createElement('thead');
            partTable.id = `PTable${i}`;
            partTable.className = "table table-striped table-bordered dataTable no-footer";
            partTable.setAttribute = ('role','grid');
            partTable.setAttribute = ('border','1');
            partTable.setAttribute = ('aria-describedby','searchTable_info');
            var partTR = document.createElement('tr');
            partTR.setAttribute = ('role','row');
            var partTH1 = document.createElement('th');
            partTH1.className = "sorting_asc"
            partTH1.setAttribute('scope','col');
            partTH1.setAttribute('tabindex','0');
            partTH1.setAttribute('aria-controls','searchTable');
            partTH1.setAttribute('rowspan','1');
            partTH1.setAttribute('colspan','1');
            partTH1.innerHTML = "Part#";

            var partTH2 = document.createElement('th');
            partTH2.className = "sorting"
            partTH2.setAttribute('scope','col');
            partTH2.setAttribute('tabindex','0');
            partTH2.setAttribute('aria-controls','searchTable');
            partTH2.setAttribute('rowspan','1');
            partTH2.setAttribute('colspan','1');
            partTH2.innerHTML = "Description";

            var partTH3 = document.createElement('th');
            partTH3.className = "sorting"
            partTH3.setAttribute('scope','col');
            partTH3.setAttribute('tabindex','0');
            partTH3.setAttribute('aria-controls','searchTable');
            partTH3.setAttribute('rowspan','1');
            partTH3.setAttribute('colspan','1');
            partTH3.innerHTML = "Quantity";

            var partTH4 = document.createElement('th');
            partTH4.className = "sorting"
            partTH4.setAttribute('scope','col');
            partTH4.setAttribute('tabindex','0');
            partTH4.setAttribute('aria-controls','searchTable');
            partTH4.setAttribute('rowspan','1');
            partTH4.setAttribute('colspan','1');
            partTH4.innerHTML = "Unit price";

            var partTH5 = document.createElement('th');
            partTH5.className = "sorting"
            partTH5.setAttribute('scope','col');
            partTH5.setAttribute('tabindex','0');
            partTH5.setAttribute('aria-controls','searchTable');
            partTH5.setAttribute('rowspan','1');
            partTH5.setAttribute('colspan','1');
            partTH5.innerHTML = "EXT";

            partTR.appendChild(partTH1);
            partTR.appendChild(partTH2);
            partTR.appendChild(partTH3);
            partTR.appendChild(partTH4);
            partTR.appendChild(partTH5);
            ptHead.appendChild(partTR)
            partTable.appendChild(ptHead);
            //add labour headder
            var labourHead = document.createElement('div');
            labourHead.className = 'col-12 ml-auto';
            labourHead.style.marginBottom = '5px';
            labourHead.style.marginTop = '5px';
            labourHead.innerHTML = "<b>Labour Section</b>";
            var partBut2 = document.createElement("button");
            partBut2.className = 'col-10 ml-auto but';
            partBut2.id = `PBut${i}`
            partBut2.style.display = 'none';
            partBut2.style.left = '12vw';
            partBut2.style.marginBottom = '10px';
            partBut2.style.marginTop = '-30px';
            partBut2.style.position = 'relative';
            partBut2.innerHTML = 'Add Labour'
            //add labour table
            var LabourTable = document.createElement('table');
            var lbHead = document.createElement('thead')
            LabourTable.id = `LTable${i}`;
            LabourTable.className = "table table-striped table-bordered dataTable no-footer";
            LabourTable.setAttribute = ('role','grid');
            LabourTable.setAttribute = ('aria-describedby','searchTable_info');
            var LabourTR = document.createElement('tr');
            LabourTR.setAttribute = ('role','row');
            var LabourTH1 = document.createElement('th');
            LabourTH1.className = "sorting_asc"
            LabourTH1.setAttribute('scope','col');
            LabourTH1.setAttribute('tabindex','0');
            LabourTH1.setAttribute('aria-controls','searchTable');
            LabourTH1.setAttribute('rowspan','1');
            LabourTH1.setAttribute('colspan','1');
            LabourTH1.innerHTML = "Technician #";

            var LabourTH2 = document.createElement('th');
            LabourTH2.className = "sorting"
            LabourTH2.setAttribute('scope','col');
            LabourTH2.setAttribute('tabindex','0');
            LabourTH2.setAttribute('aria-controls','searchTable');
            LabourTH2.setAttribute('rowspan','1');
            LabourTH2.setAttribute('colspan','1');
            LabourTH2.innerHTML = "Name";

            var LabourTH3 = document.createElement('th');
            LabourTH3.className = "sorting"
            LabourTH3.setAttribute('scope','col');
            LabourTH3.setAttribute('tabindex','0');
            LabourTH3.setAttribute('aria-controls','searchTable');
            LabourTH3.setAttribute('rowspan','1');
            LabourTH3.setAttribute('colspan','1');
            LabourTH3.innerHTML = "Hours";

            var LabourTH4 = document.createElement('th');
            LabourTH4.className = "sorting"
            LabourTH4.setAttribute('scope','col');
            LabourTH4.setAttribute('tabindex','0');
            LabourTH4.setAttribute('aria-controls','searchTable');
            LabourTH4.setAttribute('rowspan','1');
            LabourTH4.setAttribute('colspan','1');
            LabourTH4.innerHTML = "Rate";

            var LabourTH5 = document.createElement('th');
            LabourTH5.className = "sorting"
            LabourTH5.setAttribute('scope','col');
            LabourTH5.setAttribute('tabindex','0');
            LabourTH5.setAttribute('aria-controls','searchTable');
            LabourTH5.setAttribute('rowspan','1');
            LabourTH5.setAttribute('colspan','1');
            LabourTH5.innerHTML = "Total";

            LabourTR.appendChild(LabourTH1);
            LabourTR.appendChild(LabourTH2);
            LabourTR.appendChild(LabourTH3);
            LabourTR.appendChild(LabourTH4);
            LabourTR.appendChild(LabourTH5);
            lbHead.appendChild(LabourTR);
            LabourTable.appendChild(lbHead);
            
            taskEntry.appendChild(document.createTextNode(taskName));

            var taskDiv = document.createElement("div");
            var div2 = document.createElement("div");
            div2.className = "row"
            var div1 = document.createElement("div");
            div1.className = "row"
            newDiv.appendChild(taskEntry);
            taskDiv.appendChild(newDiv);
            taskDiv.appendChild(editTask);
            div2.appendChild(partHead);
            div2.appendChild(partBut);
            taskDiv.appendChild(div2);
            taskDiv.appendChild(partTable);
            div1.appendChild(labourHead);
            div1.appendChild(partBut2);
            taskDiv.appendChild(div1)
            taskDiv.appendChild(LabourTable);
            
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
                }
            }
         });
    }
    
    // this function disable the updatable input fields 
    function disableInputs(){
        saveRO.className = "btn btn-default pull-right invisible";
        editRO.className = "btn btn-default pull-right visible";
        var buts = document.getElementsByClassName('but')
        for(x=0;x<buts.length;x++){
            buts[x].style.display = 'none'
        }
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
        var buts = document.getElementsByClassName('but')
        for(x=0;x<buts.length;x++){
            buts[x].style.display = 'block'
        }
        odometerOut.disabled = false;
        openclose.disabled = false;
        openclose.style.backgroundColor = "#fff";
    }
        
    // This function prevents refreshes on enter on #roSearchInp
    $(window).keydown(function(event){
       if(event.keyCode == 13) {
         event.preventDefault();
         return false;
       }
   });

});