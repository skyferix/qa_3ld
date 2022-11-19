
class StudentAdd {
    private selectList: NodeListOf<HTMLSelectElement>;

    constructor(){
        this.setVariables();
        this.setListeners();
    }

    private setVariables(){
        this.selectList = document.querySelectorAll("select[is='studentSelect']");
    }

    private setListeners(){
        this.selectList.forEach((select) => {
            select.addEventListener('change', StudentAdd.addStudent);
        })
    }

    private static addStudent(ev:Event & {target:HTMLSelectElement}){
        let groupId = ev.target.dataset.group;
        let studentId = ev.target.selectedOptions[0].dataset.student;
        let data = {
            "groupId": groupId,
            "studentId": studentId
        };
        $.ajax({
            url: '/student/add',
            contentType: 'application/x-www-form-urlencoded',
            method: 'POST',
            data: data,
            success:function (data){
                location.reload();
            },
            error: function (data) {
                console.log(data);
            }
        })
    }

}
let addStudent = new StudentAdd();
