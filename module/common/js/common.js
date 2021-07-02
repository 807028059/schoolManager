$(".indexMenu li").on('click', function (e) {
    e.preventDefault();
    $(".indexMenu").find("li").removeClass("active");
    $(this).addClass("active");
    $("#bodyHtml").load($(this).attr("menu"));
});


// 由映射关系获取值
function returnMapping(objMap,keyValue,defaultValue) {
    for(var key in objMap){
        if(key==keyValue){
            return objMap[key]
        }
    }
    return defaultValue;
}

/**
 * 公用方法：使用AJAX获取数据
 * @param {[type]} param [参数]
 * @param {[type]} url [路径]
 * @param {[type]} callBack [成功的回调函数]
 */
function ajaxGet(param, url, callBack) {
    param = param == ""?"":JSON.stringify(param);
    $.ajax({
        type: "GET",
        url: url,
        data: param,
        dataType: "json",
        contentType: "application/json",
        success: callBack,
        error: function(xhr) {
            swal("哦呦，出错啦", {
                icon: "error",
            });
        }
    });
}
/**
 * 公用方法：使用AJAX提交数据
 * @param {[type]} param [参数]
 * @param {[type]} url [路径]
 * @param {[type]} callBack [成功的回调函数]
 */
function ajaxPost(param, url, callBack) {
    param = param == ""?"":JSON.stringify(param);
    $.ajax({
        type: "POST",
        url: url,
        data: param,
        dataType: "json",
        contentType: "application/json",
        success: callBack,
        error: function(xhr) {
            swal("哦呦，出错啦", {
                icon: "error",
            });
        }
    });
}