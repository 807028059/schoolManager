var spageNum = 1;
var spageSize = 10;
var sisFinshInit = false;
var sisFirst = true;
var sTotalCount = 0;//总条数

//初始化参数
function sinitParam() {
    spageNum = 1;
    spageSize = 10;
    sisFinshInit = false;
    sisFirst = true;
    sTotalCount = 0;//总条数
}

//查询
function sinitStudent() {
    sinitParam();
    getStudentList(spageNum,spageSize);
}

function getStudentList(_pageNum,_pageSize) {
    var grade = $("#searchGrade").val().split("-")[0];
    var clazz = $("#searchGrade").val().split("-")[1];
    var num = $("#searchNum").val();
    var param = {
        pageNum: _pageNum,
        pageSize: _pageSize,
        num: num,
        grade: grade,
        clazz:clazz
    };
    ajaxPost(param, "/schoolManager/student/getStudent", function (res) {
        if (res.resCode == "0") {
            $("#studentHtml").html("");
            var results = res.busiResp.records;
            if (results.length == 0) {
                $("#snoData").show();
                $("#sfenye").html("");
                return false;
            }
            sTotalCount = res.busiResp.total;
            if (sisFinshInit) {     // true 已完成第一次加载
                sappendToTable(results)
            } else {                 // false 第一次加载
                sappendToTable(results)
                sshowingAppPages(spageSize, spageNum);
            }
        }else{
            swal(res.resMsg, {
                icon: "error",
            });
        }
    });
}

function sappendToTable(results) {
    var html = "";
    for (var i = 0; i < results.length; i++) {
        var buttonHtml = "";
        buttonHtml += "<a Student='oprate-button' style='color:blue' onclick='showModal("+JSON.stringify(results[i])+")'>修改</a>";
        html += "<tr>" +
            "       <th scope='row'>" + (i + 1) + "</th>" +
            "       <td>" + results[i].num + "</td>" +
            "       <td>" + results[i].name + "</td>" +
            "       <td>" + results[i].sex + "</td>" +
            "       <td>" +
            "           <a class='oprate-button' style='color:blue' onclick='showScoreModal("+results[i].id+")'>成绩</a>" +
            "       </td>" +
            "    </tr>";
    }
    $("#studentHtml").html(html);
}

//分页
function sshowingAppPages(limit, curr) {
    var laypage = layui.laypage;
    laypage.render({
        elem: 'sfenye'                        // 对应  id
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
            spageNum = obj.curr
            spageSize = obj.limit
            sjumpRefresh(obj.curr)
        }
    });
}

//分页
function sjumpRefresh(pageNum) {
    if (sisFinshInit) {
        getStudentList(pageNum, spageSize);
    } else {
        sisFinshInit = true;
    }
}

var studentId = "";
//弹框显示
function showScoreModal(_studentId) {
    studentId = _studentId;
    $("#myModal").modal("hide");
    //获取科目信息
    getCourses();
    //弹框显示
    $("#score_myModal").modal("show");
}

var courseArr = [];
function getCourses() {
    ajaxGet("", "/schoolManager/course/getAllCourse?studentId="+studentId+"&examId="+examId, function (res) {
        if (res.resCode == "0") {
            var courses = res.busiResp.courses;
            var courseshtml = "";
            if (courses.length != 0) {
                for (var i = 0; i < courses.length; i++) {
                    courseshtml += "<div class='form-group row'>" +
                        "                   <label class='col-sm-3 form-control-label'>"+courses[i].course+"</label>" +
                        "                   <div class='col-sm-9'>" +
                        "                        <input id='"+courses[i].id+"' type='number' placeholder='请输入分数' class='form-control form-control-success'>" +
                        "                   </div>" +
                        "            </div>";
                    courseArr.push(courses[i].id);
                }
                $(".scoreForm").html(courseshtml);
            }
            var scores = res.busiResp.scores;
            if(scores.length != null){
                for (var i = 0; i < scores.length; i++) {
                    $("#"+scores[i].id).val(scores[i].score);
                    $("#"+scores[i].id).attr("scoreId",scores[i].scoreId);
                }
            }
        }
    });
}

//添加修改
function svOrUp() {
    $("#score_myModal").modal("hide");
    $("#myModal").modal("show");
    if(courseArr.length == 0){
        swal("不存在科目，无法保存", {
            icon: "error",
        });
        return;
    }
    var param = [];
    for(i=0;i<courseArr.length;i++){
        var obj = {};
        obj.id = $("#"+courseArr[i]).attr("scoreId");
        obj.studentId = studentId;
        obj.examId = examId;
        obj.score = $("#"+courseArr[i]).val();
        obj.courseId = courseArr[i];
        param.push(obj);
    }
    ajaxPost(param, "/schoolManager/score/saveStudentScore", function (res) {
        if (res.resCode == "0") {
            swal("操作成功", {
                icon: "success",
            }).then(initScore());
        }else{
            swal(res.resMsg, {
                icon: "error",
            });
        }
    });
}







