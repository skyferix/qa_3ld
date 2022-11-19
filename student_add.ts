
class AddStudentManager {
    private selectList: NodeListOf<HTMLSelectElement>;

    constructor() {
        this.setAttributes();
        this.setListeners();
    }

    private setAttributes() {
        this.selectList = document.querySelectorAll("select[is='studentSelect']");
    }

    private setListeners() {
        this.selectList.forEach((select) => {
            select.addEventListener('change', AddStudentManager.addStudent);
        })
    }

    private static addStudent(ev:Event & {target:HTMLSelectElement}) {
        const groupId = ev.target.dataset.group;
        const studentId = ev.target.selectedOptions[0].dataset.student;
        const data = {groupId, studentId}
        $.ajax({
            url: '/student/add',
            contentType: 'application/x-www-form-urlencoded',
            method: 'POST',
            data,
            success:function (data){
                location.reload();
            }
        }).catch(error => throw error)
    }

}
const addStudent = new AddStudentManager();
