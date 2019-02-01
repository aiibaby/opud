$(document).ready(function(){
    console.log("ready");
    
    var vinInput = document.getElementById("vinInp");
    var vinBut = document.getElementById("vinBut");
    
    vinBut.addEventListener('click', function(){
        $.ajax({
            url:"./cVIN",
            type:"post",
            data:{
                vin: vinInp.value
            },
            success:function (resp) {
                console.log(resp);
            }
        });
    })
    
    
});