$(document).ready(function(){
    console.log("ready");
    
    getSearchPage();
    
    
    function getSearchPage() {
        $.ajax({
            url:"/pages/search.html",
            dataType: "html",
            success:function (resp) {
                $('#searchPosition').html(resp);
            }
        });
    }
});