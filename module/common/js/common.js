$(".indexMenu li").on('click', function (e) {
    e.preventDefault();
    $(".indexMenu").find("li").removeClass("active");
    $(this).addClass("active");
    $("#bodyHtml").load($(this).attr("menu"));
});


/**
 * 公用方法：使用AJAX获取数据
 * @param {[type]} param [参数]
 * @param {[type]} url [路径]
 * @param {[type]} callBack [成功的回调函数]
 */
function ajaxGet(param, url, callBack) {
    $.ajax({
        type: "GET",
        url: url,
        data: $.param(param, true),
        success: callBack,
        error: function(xhr) {
            console.error("ERROR：" + url + ", xhr.status:" + xhr.status + ", xhr.statusText:" + xhr.statusText);
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
    $.ajax({
        type: "POST",
        url: url,
        data: $.param(param, true),
        success: callBack,
        error: function(xhr) {
            console.error("ERROR：" + url + ", xhr.status:" + xhr.status + ", xhr.statusText:" + xhr.statusText);
        }
    });
}