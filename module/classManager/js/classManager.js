var pNum = 1;
var pSize = 10;
var isFinshInit = false;
var isFirst = true;
var TotalCount = 0;//总条数

$(function () {
    getClassList();
});

function getClassList() {
    var url = "/schoolManager/clazz/getClazz";
    $.ajax({
        type: "POST",
        url: url,
        data: {
            pageNum:1,
            pageSize:10
        },
        dataType: "json",
        contentType: "application/json",
        success: function (res) {
            showTable(res);
        },
        error: function(xhr) {
            console.error("ERROR：" + url + ", xhr.status:" + xhr.status + ", xhr.statusText:" + xhr.statusText);
        }
    });
}

function showTable(res) {
    console.log(res);
    if (data.retCode == "0") {
        var results = data.object.list;
        if (results.length == 0) {
            $("#noData").show();
            $("#messageListTable").append(headListTMPL());
            $("#fenye").html("");
            return false;
        }
        TotalCount = data.object.total;
        if (isFinshInit) {     // true 已完成第一次加载
            appendToTable(results)
        } else {                 // false 第一次加载
            appendToTable(results)
            showingAppPages(pageSize, pageNum);
        }

    }
}


