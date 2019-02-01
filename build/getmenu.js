$(document).ready(function(){
    console.log("ready");
    
    getMenu();
    
    var menuPosition = document.getElementById("menuPosition");
    
    function getMenu() {
        $.ajax({
            url:"/pages/menu.html",
            dataType: "html",
            success:function (resp) {
                $(menuPosition).html(resp);
            }
        });
    }
});