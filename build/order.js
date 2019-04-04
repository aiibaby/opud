$(document).ready(function() {
    // user search input and parameters
    
    // buttons
    var editRO = document.getElementById("editRO");
    var saveRO = document.getElementById("saveRO");

    
    // repair order fields
    var roNum = document.getElementById("roNum");

    
    // repair order updatable fields
    var roTask = document.getElementById("roTask");
    var odometerOut= document.getElementById("odometerOut");
    var openclose = document.getElementById("openclose");
    
    // print repair order
    var openPDF = document.getElementById("openPDF");
    var openInvoice = document.getElementById("openInvoice");
    var vehicle_info = null;
    
    openPDF.onclick = function(){
        window.open(`/print?x=${roNum.innerHTML}`);
        //document.getElementById("roInfo").submit();
    }

    openInvoice.onclick = function(){
        window.open(`/printInvoice?x=${roNum.innerHTML}`);
        //document.getElementById("roInfo2").submit();
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
                vehicle_info = data;
                roTask.innerHTML="";

                // populates tasks and comments for the repair order
                populateTasksComments(data);
                addOldParts(data);

                // enable input fields when the editRO button is clicked
                editRO.onclick = function(){
                        enableInputs(data);
                }

                // disabled input fields when the saveRO button is click, save the input field values into the database
                saveRO.onclick = function(){
                    disableInputs();
                    saveComments(data);
                    updateLabour(document.getElementsByClassName('labour'))
                    updateParts(document.getElementsByClassName('parts'))
                    updateRO(saveComments(data), odometerOut.value, roID, openclose.value);
                    location.reload(); 
                    }
                                 
                }
            }
        }); 
    }
    
    function updateLabour(data){
        var id = 0;
        var c = "";
        var temp = []
        for(Element in data){
            if(Element.length < 4){
                id = data[Element].id.substring(6)
                for(row in data[Element].childNodes[0].childNodes){
                    if(row.length < 4 && parseInt(row) > 0){
                        c = data[Element].childNodes[0].childNodes[row].className
                        temp = []
                        for(item in data[Element].childNodes[0].childNodes[row].childNodes){
                            if(item.length < 4 && parseInt(item) < 4){
                                temp.push(data[Element].childNodes[0].childNodes[row].childNodes[item].childNodes[0].value)
                            }
                        }
                        $.ajax({
                            url:"/rosearch/updateLabour",
                            type:"post",
                            data:{
                                row:temp,
                                id: id,
                                type:c
                            },
                            success:function(res){
                                if (res){
                                    console.log(res);
                                }
                            }
                        });
                    }
                }
            }
        }
    }
    function updateParts(data){
        var id = 0;
        var c = "";
        var temp = []
        for(Element in data){
            if(Element.length < 4){
                id = data[Element].id.substring(6)
                for(row in data[Element].childNodes[0].childNodes){
                    if(row.length < 4 && parseInt(row) > 0){
                        c = data[Element].childNodes[0].childNodes[row].className
                        temp = []
                        for(item in data[Element].childNodes[0].childNodes[row].childNodes){
                            if(item.length < 4 && parseInt(item) < 6){
                                temp.push(data[Element].childNodes[0].childNodes[row].childNodes[item].childNodes[0].value)
                            }
                        }
                        $.ajax({
                            url:"/rosearch/updateParts",
                            type:"post",
                            data:{
                                row:temp,
                                id: id,
                                type:c
                            },
                            success:function(res){
                                if (res){
                                    console.log(res);
                                }
                            }
                        });
                    }
                }
            }
        }
    }
    searchTask(roNum.innerHTML)
    populate(document.getElementById('roNum').innerHTML)
    function Delete(row, id, type){
        for(e in document.getElementById(`${type}Table${id}`).childNodes[0].childNodes){
            if(!isNaN(parseInt(e)) && e != 0){
                if(document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].childNodes[0].childNodes[0].value == row &&
                    document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].className == "new"){
                    document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].style.backgroundColor = "#5064bd"
                    document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].className = "delnew"
                    for(data in document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].childNodes){
                        if(!isNaN(parseInt(data))){
                            document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].childNodes[data].childNodes[0].disabled = true
                        }
                    }

                }
                else if(document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].childNodes[0].childNodes[0].value == row &&
                    document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].className == "del" ){
                    document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].style.backgroundColor = ""
                    document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].className = ""
                    for(data in document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].childNodes){
                        if(!isNaN(parseInt(data))){
                            document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].childNodes[data].childNodes[0].disabled = true
                        }
                    }
                }
                else if(document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].childNodes[0].childNodes[0].value == row &&
                    document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].className == "delnew"){
                    document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].style.backgroundColor = ""
                    document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].className = "new"
                    for(data in document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].childNodes){
                        if(!isNaN(parseInt(data))){
                            document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].childNodes[data].childNodes[0].disabled = true
                        }
                    }
                }
                else if(document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].childNodes[0].childNodes[0].value == row &&
                    document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].className != "del" ){
                    document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].style.backgroundColor = "#5064bd"
                    document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].className = "del"
                    for(data in document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].childNodes){
                        if(!isNaN(parseInt(data))){
                            document.getElementById(`${type}Table${id}`).childNodes[0].childNodes[e].childNodes[data].childNodes[0].disabled = true
                        }
                    }
                }
            }
            
        }
        return null
    }
    function populate(id){
        $.ajax({
            url:"/rosearch/AroSearch",
            type:"post",
            data:{
                roSearchWord:id,
                roSearchBy:'ro_id',
                roStatus:'all',  
            },
            success:function(data){
                if (data){
                    // var is not defined for resultsTable as it will cause a bug where the datatable will not read the data correctly 
                    // this function display a popup screen that display relevant repair order information
                    document.getElementById('promiseDate').innerHTML=`${data[0].promised_time.substring(11,16)} on ${data[0].promised_time.substring(0,10)} `
                    document.getElementById('roCustName').innerHTML=`${data[0].first_name} ${data[0].last_name}`
                    document.getElementById('roTel').innerHTML=`${data[0].home_phone}`
                    document.getElementById('roCell').innerHTML=`${data[0].cell_phone}`
                    document.getElementById('roVIN').innerHTML=`${data[0].vin}`
                    document.getElementById('roModel').innerHTML=`${data[0].model}`
                    document.getElementById('roLicense').innerHTML=`${data[0].license_plate}`
                    document.getElementById('roYear').innerHTML=`${data[0].year}`
                    document.getElementById('roOdometerIn').innerHTML=`${data[0].odometer_in}`
                    if(isNaN(data[0].odometer_out)){
                        document.getElementById('odometerOut').value=0
                    }else{
                        document.getElementById('odometerOut').value=`${data[0].odometer_out}`
                    }
                    document.getElementById('roMake').innerHTML=`${data[0].make}`
                    document.getElementById('roNotes').innerHTML=`${data[0].vehicle_notes}`
                    document.getElementById('openclose').value=`${data[0].status}`
                }
                else{
                    alert("Error! taskSearch");
                }
            }  
        });
    }
    function addOldParts(data){

        for(var i = 0; i<data.length; i++){
            var task_id = data[i].worktask_id;
            $.ajax({
                url:"/rosearch/PartSearch",
                type:"post",
                data:{
                    id:data[i].worktask_id 
                },
                success:function(data){
                    for(row in data){
                        ptHead = document.getElementById(`PTable${data[row].worktask_id}`).childNodes[0]
                        var partTR = document.createElement('tr');
                        partTR.setAttribute = ('role','row');
                        partTR.className = `old`
                        var partTH1 = document.createElement('th');
                        partTH1.className = "sorting_asc"
                        var partTH2 = document.createElement('th');
                        partTH2.className = "sorting"
                        var partTH6 = document.createElement('th');
                        partTH6.className = "sorting"
                        var partTH7 = document.createElement('th');
                        partTH7.className = "sorting"
                        var partTH3 = document.createElement('th');
                        partTH3.className = "sorting"
                        var partTH4 = document.createElement('th');
                        partTH4.className = "sorting"
                        var partTH5 = document.createElement('th');
                        partTH5.className = "sorting"
                        var inp1= document.createElement('textarea')
                        inp1.className = 'inp'
                        inp1.style.height='auto'
                        inp1.style.width='10vw'
                        inp1.value = `${data[row].part_no}`
                        inp1.disabled = true
                        var inp2= document.createElement('textarea')
                        inp2.className = 'inp'
                        inp2.style.height='auto'
                        inp2.style.width='10vw'
                        inp2.value =  `${data[row].part_desc}`
                        inp2.disabled = true
                        var inp3= document.createElement('textarea')
                        inp3.className = 'inp'
                        inp3.style.height='auto'
                        inp3.style.width='10vw'
                        inp3.value = `${data[row].qty}`
                        inp3.disabled = true
                        var inp4= document.createElement('textarea')
                        inp4.className = 'inp'
                        inp4.style.height='auto'
                        inp4.style.width='10vw'
                        inp4.value = `${data[row].unit_price}`
                        inp4.disabled = true
                        var inp5= document.createElement('textarea')
                        inp5.className = 'inp'
                        inp5.style.height='auto'
                        inp5.style.width='10vw'
                        inp5.value = `${data[row].sell_price}`
                        inp5.disabled = true
                        var inp6= document.createElement('textarea')
                        inp6.className = 'inp'
                        inp6.style.height='auto'
                        inp6.style.width='10vw'
                        inp6.value = `${data[row].supplier_name}`
                        inp6.disabled = true
                        partTH1.appendChild(inp1);
                        partTH2.appendChild(inp2);
                        partTH3.appendChild(inp3);
                        partTH4.appendChild(inp4);
                        partTH7.appendChild(inp5);
                        partTH6.appendChild(inp6);
                        partTH5.innerHTML=`${Math.round(data[row].qty * data[row].sell_price* 100) / 100}`;

                        partTR.appendChild(partTH1);
                        partTR.appendChild(partTH6);
                        partTR.appendChild(partTH2);
                        partTR.appendChild(partTH4);
                        partTR.appendChild(partTH7);
                        partTR.appendChild(partTH3);
                        partTR.appendChild(partTH5);
                        ptHead.appendChild(partTR)
                    }
                }
            })
            $.ajax({
                url:"/rosearch/LabourSearch",
                type:"post",
                data:{
                    id:data[i].worktask_id 
                },
                success:function(data){
                    for(row in data){
                        LHead = document.getElementById(`LTable${data[row].worktask_id}`).childNodes[0]
                        var LabourTR = document.createElement('tr');
                        LabourTR.setAttribute = ('role','row');
                        LabourTR.className = `${data[row].labour_id}`
                        var LabourTH1 = document.createElement('th');
                        LabourTH1.className = "sorting_asc"

                        var LabourTH2 = document.createElement('th');
                        LabourTH2.className = "sorting"

                        var LabourTH3 = document.createElement('th');
                        LabourTH3.className = "sorting"

                        var LabourTH4 = document.createElement('th');
                        LabourTH4.className = "sorting"

                        var LabourTH5 = document.createElement('th');
                        LabourTH5.className = "sorting"

                        var inp1= document.createElement('textarea')
                        inp1.className = 'inp'
                        inp1.style.height='auto'
                        inp1.style.width='17vw'
                        inp1.value = `${data[row].tech_no}`
                        inp1.disabled = true
                        var inp2= document.createElement('textarea')
                        inp2.className = 'inp'
                        inp2.style.height='auto'
                        inp2.style.width='17vw'
                        inp2.value = `${data[row].tech_name}`
                        inp2.disabled = true
                        var inp3= document.createElement('textarea')
                        inp3.className = 'inp'
                        inp3.style.height='auto'
                        inp3.style.width='17vw'
                        inp3.value = `${data[row].hours}`
                        inp3.disabled = true
                        var inp4= document.createElement('textarea')
                        inp4.className = 'inp'
                        inp4.style.height='auto'
                        inp4.style.width='17vw'
                        inp4.value = `${data[row].rate}`
                        
                        inp4.disabled = true
                        var inp5= document.createElement('textarea')
                        inp5.className = 'inp'
                        inp5.style.height='auto'
                        inp5.style.width='17vw'
                        LabourTH1.appendChild(inp1);
                        LabourTH2.appendChild(inp2);
                        LabourTH3.appendChild(inp3);
                        LabourTH4.appendChild(inp4);
                        LabourTH5.innerHTML=`${Math.round(data[row].rate * data[row].hours* 100) / 100}`;

                        

                        LabourTR.appendChild(LabourTH1);
                        LabourTR.appendChild(LabourTH2);
                        LabourTR.appendChild(LabourTH3);
                        LabourTR.appendChild(LabourTH4);
                        LabourTR.appendChild(LabourTH5);
                        LHead.appendChild(LabourTR);
                    }
                }
            })
        }
    }
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
            partBut.id = `PBut${data[i].worktask_id}`
            partBut.style.display = 'none';
            partBut.style.left = '12vw';
            partBut.style.marginBottom = '10px';
            partBut.style.marginTop = '-30px';
            partBut.style.position = 'relative';
            partBut.innerHTML = 'Add Part'
            var partButdel = document.createElement("button");
            partButdel.className = 'col-10 ml-auto but';
            partButdel.id = `PBut2${data[i].worktask_id}`
            partButdel.style.display = 'none';
            partButdel.style.left = '24vw';
            partButdel.style.marginBottom = '10px';
            partButdel.style.top = '-10px';
            partButdel.style.marginTop = '-30px';
            partButdel.style.position = 'relative';
            partButdel.innerHTML = 'Remove Part'
            //add parts table
            var div1 = document.createElement('div');
            var partTable = document.createElement('table');
            var ptHead = document.createElement('thead');
            partTable.id = `PTable${data[i].worktask_id}`;
            partTable.className = "parts table table-striped table-bordered dataTable no-footer";
            partTable.setAttribute = ('role','grid');
            partTable.setAttribute = ('border','1');
            partTable.setAttribute = ('aria-describedby','searchTable_info');
            var partTR = document.createElement('tr');
            partTR.setAttribute = ('role','row');
            partTR.className = `${data[i].part_id}`
            var partTH1 = document.createElement('th');
            partTH1.className = "sorting_asc"
            partTH1.innerHTML = "Part#";

            var partTH2 = document.createElement('th');
            partTH2.className = "sorting"
            partTH2.innerHTML = "Description";

            var partTH6 = document.createElement('th');
            partTH6.className = "sorting"
            partTH6.innerHTML = "Supplier Name";

            var partTH7 = document.createElement('th');
            partTH7.className = "sorting"
            partTH7.innerHTML = "Unit Price";

            var partTH3 = document.createElement('th');
            partTH3.className = "sorting"
            partTH3.innerHTML = "Quantity";

            var partTH4 = document.createElement('th');
            partTH4.className = "sorting"
            partTH4.innerHTML = "Cost";

            var partTH5 = document.createElement('th');
            partTH5.className = "sorting"
            partTH5.innerHTML = "Extended Amount";

            partTR.appendChild(partTH1);
            partTR.appendChild(partTH6);
            partTR.appendChild(partTH2);
            partTR.appendChild(partTH4);
            partTR.appendChild(partTH7);
            partTR.appendChild(partTH3);
            partTR.appendChild(partTH5);
            ptHead.appendChild(partTR)
            
            
            partTable.appendChild(ptHead);
            partBut.onclick = function() {
                var row = document.getElementById(`PTable${event.target.id.substring(4)}`).insertRow(-1);
                row.className = "new";
                // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                var cell6 = row.insertCell(5);
                var cell7 = row.insertCell(6);
                

                // Add some text to the new cells:
                var inp1= document.createElement('textarea')
                inp1.className = 'inp'
                inp1.style.height='auto'
                inp1.style.width='-webkit-fill-available'
                var inp2= document.createElement('textarea')
                inp2.className = 'inp'
                inp2.style.height='auto'
                inp2.style.width='-webkit-fill-available'
                var inp3= document.createElement('textarea')
                inp3.className = 'inp'
                inp3.style.height='auto'
                inp3.style.width='-webkit-fill-available'
                var inp4= document.createElement('textarea')
                inp4.className = 'inp'
                inp4.style.height='auto'
                inp4.style.width='-webkit-fill-available'
                var inp5= document.createElement('textarea')
                inp5.className = 'inp'
                inp5.style.height='auto'
                inp5.style.width='-webkit-fill-available'
                var inp6= document.createElement('textarea')
                inp6.className = 'inp'
                inp6.style.height='auto'
                inp6.style.width='-webkit-fill-available'
                cell1.appendChild(inp1);
                cell2.appendChild(inp2);
                cell3.appendChild(inp3);
                cell4.appendChild(inp4);
                cell5.appendChild(inp5);
                cell6.appendChild(inp6);
                cell7.innerHTML=`0`;
            }
            partButdel.onclick = function() {
                id = event.target.id.substring(5)
                swal({
                    text: 'What Part do you want to remove',
                    content: "input",
                    button: {
                      text: "Search!",
                      closeModal: false,
                    },
                  })
                  .then(name => {
                    if (name == "") throw null;
                    try{
                        Delete(name, id, "P")
                        swal("Part Removed / Readded");
                    }catch(err){
                        console.log(err)
                        throw(err)
                    }
                  })
                  .catch(err => {
                    if (err) {
                      swal("Oh noes!", "Part not found", "error");
                    } else {
                      swal.stopLoading();
                      swal.close();
                    }
                  });
            }
            //////
            //add labour headder
            var labourHead = document.createElement('div');
            labourHead.className = 'col-12 ml-auto';
            labourHead.style.marginBottom = '5px';
            labourHead.style.marginTop = '5px';
            labourHead.innerHTML = "<b>Labour Section</b>";
            var partBut2 = document.createElement("button");
            partBut2.className = 'col-10 ml-auto but';
            partBut2.id = `LBut${data[i].worktask_id}`
            partBut2.style.display = 'none';
            partBut2.style.left = '12vw';
            partBut2.style.marginBottom = '10px';
            partBut2.style.marginTop = '-30px';
            partBut2.style.position = 'relative';
            partBut2.innerHTML = 'Add Labour'
            var partBut2del = document.createElement("button");
            partBut2del.className = 'col-10 ml-auto but';
            partBut2del.id = `LBut${data[i].worktask_id}`
            partBut2del.style.display = 'none';
            partBut2del.style.left = '24vw';
            partBut2del.style.marginBottom = '10px';
            partBut2del.style.top = '-10px';
            partBut2del.style.marginTop = '-30px';
            partBut2del.style.position = 'relative';
            partBut2del.innerHTML = 'Remove Labour'
            //add labour table
            var LabourTable = document.createElement('table');
            var lbHead = document.createElement('thead')
            LabourTable.id = `LTable${data[i].worktask_id}`;
            LabourTable.className = "labour table table-striped table-bordered dataTable no-footer";
            LabourTable.setAttribute = ('role','grid');
            LabourTable.setAttribute = ('aria-describedby','searchTable_info');
            var LabourTR = document.createElement('tr');
            LabourTR.setAttribute = ('role','row');
            LabourTR.className = `${data[i].labour_id}`
            var LabourTH1 = document.createElement('th');
            LabourTH1.className = "sorting_asc"
            LabourTH1.innerHTML = "Technician #";

            var LabourTH2 = document.createElement('th');
            LabourTH2.className = "sorting"
            LabourTH2.innerHTML = "Name";

            var LabourTH3 = document.createElement('th');
            LabourTH3.className = "sorting"
            LabourTH3.innerHTML = "Hours";

            var LabourTH4 = document.createElement('th');
            LabourTH4.className = "sorting"
            LabourTH4.innerHTML = "Rate";

            var LabourTH5 = document.createElement('th');
            LabourTH5.className = "sorting"
            LabourTH5.innerHTML = "Total";

            LabourTR.appendChild(LabourTH1);
            LabourTR.appendChild(LabourTH2);
            LabourTR.appendChild(LabourTH3);
            LabourTR.appendChild(LabourTH4);
            LabourTR.appendChild(LabourTH5);
            lbHead.appendChild(LabourTR);
            LabourTable.appendChild(lbHead);

            partBut2.onclick = function() {
                var row = document.getElementById(`LTable${event.target.id.substring(4)}`).insertRow(-1);
                row.className = "new" 
                // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
                var cell21 = row.insertCell(0);
                var cell22 = row.insertCell(1);
                var cell23 = row.insertCell(2);
                var cell24 = row.insertCell(3);
                var cell25 = row.insertCell(4);

                // Add some text to the new cells:
                var inp1= document.createElement('textarea')
                inp1.className = 'inp'
                inp1.style.height='auto'
                inp1.style.width='-webkit-fill-available'
                var inp2= document.createElement('textarea')
                inp2.className = 'inp'
                inp2.style.height='auto'
                inp2.style.width='-webkit-fill-available'
                var inp3= document.createElement('textarea')
                inp3.className = 'inp'
                inp3.style.height='auto'
                inp3.style.width='-webkit-fill-available'
                var inp4= document.createElement('textarea')
                inp4.className = 'inp'
                inp4.style.height='auto'
                inp4.style.width='-webkit-fill-available'
                var inp5= document.createElement('textarea')
                inp5.className = 'inp'
                inp5.style.height='auto'
                inp5.style.width='-webkit-fill-available'
                cell21.appendChild(inp1);
                cell22.appendChild(inp2);
                cell23.appendChild(inp3);
                cell24.appendChild(inp4);
                cell25.innerHTML=`0`;
            }
            partBut2del.onclick = function() {
                id = event.target.id.substring(4)
                swal({
                    text: 'What Part do you want to Remove / Add Back',
                    content: "input",
                    button: {
                      text: "Search!",
                      closeModal: false,
                    },
                  })
                  .then(name => {
                    if (name == "") throw null;
                    try{
                        Delete(name, id, "L")
                        swal("Part Removed / Readded");
                    }catch(err){
                        console.log(err)
                        throw(err)
                    }
                  })
                  .catch(err => {
                    if (err) {
                      swal("Oh noes!", "Part not found", "error");
                    } else {
                      swal.stopLoading();
                      swal.close();
                    }
                  });
            }
            
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
            div2.appendChild(partButdel);
            taskDiv.appendChild(div2);
            taskDiv.appendChild(partTable);
            div1.appendChild(labourHead);
            div1.appendChild(partBut2);
            div1.appendChild(partBut2del);
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
        var buts = document.getElementsByClassName('inp')
        for(x=0;x<buts.length;x++){
            buts[x].disabled = true
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
        var buts = document.getElementsByClassName('inp')
        for(x=0;x<buts.length;x++){
            buts[x].disabled = false
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
   disableInputs()
});