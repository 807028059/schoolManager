var pageNum = 1;
var pageSize = 10;
var isFinshInit = false;
var isFirst = true;
var TotalCount = 0;//总条数

$(function () {
    console.log(1)
    getSelect();
    initStudent();
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
function initStudent() {
    initParam();
    getStudentList(pageNum,pageSize);
}

function getStudentList(_pageNum,_pageSize) {
    var _student = $("#searchStudent").val() == "请选择"?"":$("#searchStudent").val();
    var param = {
        pageNum: _pageNum,
        pageSize: _pageSize,
        name: _student
    };
    ajaxPost(param, "/schoolManager/student/getStudent", function (res) {
        if (res.resCode == "0") {
            $("#studentHtml").html("");
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
        buttonHtml += "<a Student='oprate-button' style='color:blue' onclick='showModal("+JSON.stringify(results[i])+")'>修改</a>";
        html += "<tr>" +
            "       <th scope='row'>" + (i + 1) + "</th>" +
            "       <td>" + results[i].grade + "</td>" +
            "       <td>" + results[i].clazz + "</td>" +
            "       <td>" + results[i].num + "</td>" +
            "       <td>" + results[i].name + "</td>" +
            "       <td>" + results[i].sex + "</td>" +
            "       <td>" + results[i].create_time + "</td>" +
            "       <td>" +
            "           <a class='oprate-button' style='color:blue' onclick='showModal("+JSON.stringify(results[i])+")'>修改</a>" +
            "           <a class='oprate-button' style='color:blue' onclick='delStudent("+results[i].id+")'>删除</a>" +
            "           <a class='oprate-button' style='color:blue' onclick='delStudent("+results[i].id+")'>成绩查看</a>" +
            "       </td>" +
            "    </tr>";
    }
    $("#studentHtml").html(html);
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
        getStudentList(pageNum, pageSize);
    } else {
        isFinshInit = true;
    }
}

//弹框显示
function showModal(_obj) {
    $("#sid").val(_obj.id);
    $("#grade").val(_obj.grade);
    $("#clazz").val(_obj.clazz);
    $("#num").val(_obj.num);
    $("#name").val(_obj.name);
    $("#sex").val(_obj.sex);
    $(".modalButton").click();
}

//添加修改
function svOrUp() {
    var id = $("#sid").val();
    var grade = $("#grade").val() == "请选择"?"":$("#grade").val();
    var clazz = $("#clazz").val() == "请选择"?"":$("#clazz").val();
    var num = $("#num").val();
    var name = $("#name").val();
    var sex = $("#sex").val() == "请选择"?"":$("#sex").val();
    var param = {
        id:id,
        grade: grade,
        clazz: clazz,
        num: num,
        name: name,
        sex: sex
    };
    $(".closeButton").click();
    ajaxPost(param, "/schoolManager/student/svOrUp", function (res) {
        //置空
        $("#sid").val("");
        $("#grade").val("请选择");
        $("#clazz").val("请选择");
        $("#num").val("");
        $("#name").val("");
        $("#sex").val("");
        if (res.resCode == "0") {
            swal("操作成功", {
                icon: "success",
            }).then(initStudent());
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
            $("#grade").html(gradehtml);
            $("#searchGrade").html(gradehtml);
            var clazzhtml = "<option>请选择</option>";
            if (clazzs.length != 0) {
                for(var i = 0;i<clazzs.length;i++){
                    clazzhtml += "<option>"+clazzs[i]+"</option>";
                }
            }
            $("#clazz").html(clazzhtml);
            $("#searchClazz").html(clazzhtml);
        }
    });
}

function delStudent(_id) {
    swal({
        title: "确认弹框",
        text: "确认删除此学生么？删除后此学生下的成绩将一并删除！",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((flag) => {
        if (flag) {
            ajaxGet("", "/schoolManager/student/delStudent?studentId="+_id, function (res) {
                if (res.resCode == "0") {
                    swal("操作成功", {
                        icon: "success",
                    }).then(initStudent());
                }else{
                    swal(res.resMsg, {
                        icon: "error",
                    });
                }
            });
        }
    })
}


