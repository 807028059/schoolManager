var pageNum = 1;
var pageSize = 10;
var isFinshInit = false;
var isFirst = true;
var TotalCount = 0;//总条数

$(function () {
    console.log("clazz")
    getSelect();
    initClass();
});

//初始化参数
function initParam() {
    pageNum = 1;
    pageSize = 10;
    isFinshInit = false;
    isFirst = true;
    TotalCount = 0;//总条数
}

//查询
function initClass() {
    initParam();
    getClassList(pageNum,pageSize);
}

function getClassList(_pageNum,_pageSize) {
    var _grade = $("#searchGrade").val() == "请选择"?"":$("#searchGrade").val();
    var _clazz = $("#searchClazz").val() == "请选择"?"":$("#searchClazz").val();
    var param = {
        pageNum: _pageNum,
        pageSize: _pageSize,
        grade: _grade,
        clazz: _clazz
    };
    ajaxPost(param, "/schoolManager/clazz/getClazz", function (res) {
        if (res.resCode == "0") {
            $("#clazzHtml").html("");
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
        }else{
            swal(res.resMsg, {
                icon: "error",
            });
        }
    });
}

function getSelect() {
    ajaxGet("", "/schoolManager/clazz/getSelect", function (res) {
        if (res.resCode == "0") {
            var grades = res.busiResp.grade;
            var clazzs = res.busiResp.clazz;
            var gradehtml = "<option>请选择</option>";
            if (grades.length != 0) {
                for(var i = 0;i<grades.length;i++){
                    gradehtml += "<option>"+grades[i]+"</option>";
                }
            }
            $("#searchGrade").html(gradehtml);
            var clazzhtml = "<option>请选择</option>";
            if (clazzs.length != 0) {
                for(var i = 0;i<clazzs.length;i++){
                    clazzhtml += "<option>"+clazzs[i]+"</option>";
                }
            }
            $("#searchClazz").html(clazzhtml);
        }
    });
}

var map = {"0":"未毕业","1":"已毕业"};
function appendToTable(results) {
    var html = "";
    for (var i = 0; i < results.length; i++) {
        var buttonHtml = "";
        if(results[i].status == "0"){
            buttonHtml += "<a class='oprate-button' style='color:blue' onclick='setStatus("+results[i].id+")'>结业</a>"
        }
        buttonHtml += "<a class='oprate-button' style='color:blue' onclick='showModal("+JSON.stringify(results[i])+")'>修改</a>";
        html += "<tr>" +
            "       <th scope='row'>" + (i + 1) + "</th>" +
            "       <td>" + results[i].grade + "</td>" +
            "       <td>" + results[i].clazz + "</td>" +
            "       <td>" + results[i].num + "</td>" +
            "       <td>" + returnMapping(map,results[i].status,'') + "</td>" +
            "       <td>" + buttonHtml + "</td>" +
            "    </tr>";
    }
    $("#clazzHtml").html(html);
}

//分页
function showingAppPages(limit, curr) {
    var laypage = layui.laypage;
    laypage.render({
        elem: 'fenye'                        // 对应  id
        , limit: limit                      // 每页显示多少条数量 appPageSize
        , limits: [10, 20, 50] // 每页显示多少条数量 pagesize
        , curr: curr                        // 默认选中的页码
        //, groups: groups                    // 页码组          页面显示的页码数量
        , count: TotalCount              //  总共多少条 ，这个需要根据ajax先查询总共有多少条
        , prev: " "
        , next: " "
        , theme: '#6610f2'                  // 颜色
        , layout: ['count', 'limit', 'prev', 'page', 'next'] // 布局 //,'limit'
        , jump: function (obj) {
            pageNum = obj.curr
            pageSize = obj.limit
            jumpRefresh(obj.curr)
        }
    });
}

//分页
function jumpRefresh(pageNum) {
    if (isFinshInit) {
        getClassList(pageNum, pageSize);
    } else {
        isFinshInit = true;
    }
}

//弹框显示
function showModal(_obj) {
    $("#grade").val(_obj.grade);
    $("#clazz").val(_obj.clazz);
    $("#sid").val(_obj.id);
    $(".modalButton").click();
}

//添加修改
function svOrUp() {
    var id = $("#sid").val();
    var grade = $("#grade").val();
    var clazz = $("#clazz").val();
    var param = {
        id:id,
        grade: grade,
        clazz: clazz
    };
    $(".closeButton").click();
    ajaxPost(param, "/schoolManager/clazz/svOrUp", function (res) {
        //置空
        $("#sid").val("");
        $("#grade").val("");
        $("#clazz").val("");
        if (res.resCode == "0") {
            swal("操作成功", {
                icon: "success",
            }).then(initClass());
        }else{
            swal(res.resMsg, {
                icon: "error",
            });
        }
    });
}

function setStatus(_id) {
    ajaxGet("", "/schoolManager/clazz/setStatus?id="+_id, function (res) {
        if (res.resCode == "0") {
            swal("操作成功", {
                icon: "success",
            }).then(initClass());
        }else{
            swal(res.resMsg, {
                icon: "error",
            });
        }
    });
}


