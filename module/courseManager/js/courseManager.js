var pageNum = 1;
var pageSize = 10;
var isFinshInit = false;
var isFirst = true;
var TotalCount = 0;//总条数

$(function () {
    console.log(1)
    initCourse();
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
function initCourse() {
    initParam();
    getCourseList(pageNum,pageSize);
}

function getCourseList(_pageNum,_pageSize) {
    var _course = $("#searchCourse").val() == "请选择"?"":$("#searchCourse").val();
    var param = {
        pageNum: _pageNum,
        pageSize: _pageSize,
        course: _course
    };
    ajaxPost(param, "/schoolManager/course/getCourse", function (res) {
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
        }else{
            swal(res.resMsg, {
                icon: "error",
            });
        }
    });
}

function appendToTable(results) {
    var html = "";
    for (var i = 0; i < results.length; i++) {
        var buttonHtml = "";
        buttonHtml += "<a Course='oprate-button' style='color:blue' onclick='showModal("+JSON.stringify(results[i])+")'>修改</a>";
        html += "<tr>" +
            "       <th scope='row'>" + (i + 1) + "</th>" +
            "       <td>" + results[i].course + "</td>" +
            "       <td>" + results[i].passScore + "</td>" +
            "       <td>" + results[i].createTime + "</td>" +
            "       <td>" +
            "           <a class='oprate-button' style='color:blue' onclick='showModal("+JSON.stringify(results[i])+")'>修改</a>" +
            "           <a class='oprate-button' style='color:blue' onclick='delCourse("+results[i].id+")'>删除</a></td>" +
            "    </tr>";
    }
    $("#courseHtml").html(html);
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
        getCourseList(pageNum, pageSize);
    } else {
        isFinshInit = true;
    }
}

//弹框显示
function showModal(_obj) {
    $("#course").val(_obj.course);
    $("#passScore").val(_obj.passScore);
    $("#cid").val(_obj.id);
    $(".modalButton").click();
}

//添加修改
function svOrUp() {
    var id = $("#cid").val();
    var course = $("#course").val();
    var passScore = $("#passScore").val();
    var param = {
        id:id,
        course: course,
        passScore: passScore
    };
    $(".closeButton").click();
    ajaxPost(param, "/schoolManager/course/svOrUp", function (res) {
        //置空
        $("#cid").val("");
        $("#course").val("");
        $("#passScore").val("");
        if (res.resCode == "0") {
            swal("操作成功", {
                icon: "success",
            }).then(initCourse());
        }else{
            swal(res.resMsg, {
                icon: "error",
            });
        }
    });
}

function delCourse(_id) {
    swal({
        title: "确认弹框",
        text: "确认删除此科目么？删除后此科目下的学生成绩将一并删除！",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((flag) => {
        if (flag) {
            ajaxGet("", "/schoolManager/course/delCourse?courseId="+_id, function (res) {
                if (res.resCode == "0") {
                    swal("操作成功", {
                        icon: "success",
                    }).then(initCourse());
                }else{
                    swal(res.resMsg, {
                        icon: "error",
                    });
                }
            });
        }
    })
}


