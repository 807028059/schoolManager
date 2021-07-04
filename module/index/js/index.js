$(function () {
    getTopData();
    //获取年级，班级
    getSelect();
    //获取考试
    getAllExams();
})

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
        }else{
            $("#searchGrade").html("<option>请选择</option>");
            $("#searchClazz").html("<option>请选择</option>");
        }
    });
}

//获取所有考试
function getAllExams() {
    ajaxGet("", "/schoolManager/exam/getAllExam", function (res) {
        if (res.resCode == "0") {
            var exams = res.busiResp;
            var examshtml = "<option>请选择</option>";
            if (exams.length != 0) {
                for(var i = 0;i<exams.length;i++){
                    examshtml += "<option value='"+exams[i].id+"'>"+exams[i].exam+"</option>";
                }
                $("#searchExam").html(examshtml);
            }else{
                $("#searchExam").html("<option>请选择</option>");
            }
        }
    });
}

function getTopData() {
    ajaxGet("", "/schoolManager/index/getTopData", function (res) {
        if (res.resCode == "0") {
            var result = res.busiResp;
            $("#clazzs").html(result.clazzs);
            $("#students").html(result.students);
            $("#courses").html(result.courses);
            $("#exams").html(result.exams);
        }
    });
}

