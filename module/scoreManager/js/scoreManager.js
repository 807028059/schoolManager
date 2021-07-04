var pageNum = 1;
var pageSize = 10;
var isFinshInit = false;
var isFirst = true;
var TotalCount = 0;//总条数

$(function () {
    console.log(1);
    initScore();
    getSelect();
    getAllExams();
    getAllGrades();
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
function initScore() {
    initParam();
    getScoreList(pageNum,pageSize);
}

function getScoreList(_pageNum,_pageSize) {
    var grade = $("#searchListGrade").val() == "请选择"?"":$("#searchListGrade").val();
    var clazz = $("#searchListClazz").val() == "请选择"?"":$("#searchListClazz").val();
    var num = $("#searchListNum").val()
    var param = {
        pageNum: _pageNum,
        pageSize: _pageSize,
        grade: grade,
        clazz:clazz,
        num:num
    };
    ajaxPost(param, "/schoolManager/score/getStudentScoreList", function (res) {
        if (res.resCode == "0") {
            $("#scoreHtml").html("");
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
        html += "<tr>" +
            "       <th scope='row'>" + (i + 1) + "</th>" +
            "       <td>" + results[i].grade + "</td>" +
            "       <td>" + results[i].clazz + "</td>" +
            "       <td>" + results[i].num + "</td>" +
            "       <td>" + results[i].name + "</td>" +
            "       <td>" + results[i].sex + "</td>" +
            "       <td>" + results[i].exam + "</td>" +
            "       <td>" + results[i].total + "</td>" +
            "       <td>" +
            "           <a class='oprate-button' style='color:blue' onclick='showScoreModal("+results[i].student_id+")'>修改</a>" +
            "           <a class='oprate-button' style='color:blue' onclick='delScore("+results[i].exam_id+","+results[i].student_id+")'>删除</a></td>" +
            "    </tr>";
    }
    $("#scoreHtml").html(html);
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
        getScoreList(pageNum, pageSize);
    } else {
        isFinshInit = true;
    }
}

//弹框显示
function showStudentScoreModal(_obj) {
    //弹框显示
    $("#myModal").modal("show");
}

var examId = "";
var clazzId = "";
//获取所有考试
function getAllExams() {
    ajaxGet("", "/schoolManager/exam/getAllExam", function (res) {
        if (res.resCode == "0") {
            var exams = res.busiResp;
            var examshtml = "";
            if (exams.length != 0) {
                for(var i = 0;i<exams.length;i++){
                    examshtml += "<option value='"+exams[i].id+"'>"+exams[i].exam+"</option>";
                }
                examId = exams[0].id;
                $("#searchExam").html(examshtml);
            }else{
                $("#searchExam").html("<option>请选择</option>");
            }
        }
    });
}

//获取所有年纪
function getAllGrades() {
    ajaxGet("", "/schoolManager/clazz/getAllClazz", function (res) {
        if (res.resCode == "0") {
            var grades = res.busiResp;
            var gradeshtml = "";
            if (grades.length != 0) {
                for(var i = 0;i<grades.length;i++){
                    gradeshtml += "<option>"+grades[i].grade+"-"+grades[i].clazz+"</option>";
                }
                clazzId = grades[0].id;
                $("#searchGrade").html(gradeshtml);
                //初始化学生列表
                sinitStudent();
            }else{
                $("#searchGrade").html("<option>请选择</option>");
            }
        }
    });
}

//考试选项
function selectOnExams(obj) {
    examId = obj.options[obj.selectedIndex].value;
}

//班级选项
function selectOnGrades(obj) {
    clazzId = obj.options[obj.selectedIndex].value;
    //获取学生列表
    sinitStudent();
}

function delScore(_examId,_studentId) {
    swal({
        title: "确认弹框",
        text: "确认删除此学生的考试成绩么？删除后此学生下的考试成绩将被删除！",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((flag) => {
        if (flag) {
            ajaxGet("", "/schoolManager/score/delStudentScore?examId="+_examId+"&studentId="+_studentId, function (res) {
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
    })
}

//获取选项
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
            $("#searchListGrade").html(gradehtml);
            var clazzhtml = "<option>请选择</option>";
            if (clazzs.length != 0) {
                for(var i = 0;i<clazzs.length;i++){
                    clazzhtml += "<option>"+clazzs[i]+"</option>";
                }
            }
            $("#searchListClazz").html(clazzhtml);
        }
    });
}
