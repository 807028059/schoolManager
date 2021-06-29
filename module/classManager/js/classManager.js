var pNum = 1;
var pSize = 10;
var isFinshInit = false;
var isFirst = true;
var TotalCount = 0;//总条数

$(function () {
    getClassList();
});

function getClassList() {
    var param = {
        pageNum: 1,
        pageSize: 10,
        grade: "1",
        clazz: "1"
    };
    ajaxPost(param, "/schoolManager/clazz/getClazz", function (res) {
        if (res.resCode == "0") {
            var results = res.busiResp.records;
            if (results.length == 0) {
                $("#noData").show();
                $("#fenye").html("");
                return false;
            }
            TotalCount = res.busiResp.total;
            if (isFinshInit) {     // true 已完成第一次加载
                appendToTable(results)
            } else {                 // false 第一次加载
                appendToTable(results)
                showingAppPages(pageSize, pageNum);
            }

        }
    });
}

function appendToTable(results) {
    var html = "";
    for (var i = 0; i < results.length; i++) {
        html += "<tr>" +
            "   <th scope='row'>" + (i + 1) + "</th>" +
            "   <td>" + results[i].grade + "</td>" +
            "   <td>" + results[i].clazz + "</td>" +
            "   <td>" + results[i].status + "</td>" +
            "   <td>查看</td>" +
            "   </tr>";
    }
}


