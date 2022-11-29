
class DeleteStudent{
    private questionModal: HTMLDivElement;
    private deleteButtons: NodeListOf<HTMLButtonElement>;
    private deleteBtn:HTMLInputElement;
    private closeButtons: NodeListOf<HTMLButtonElement>;
    private modalMessage: HTMLDivElement;

    constructor(){
        this.setVariables();
        this.setListeners();
    }

    private setVariables(){
        this.questionModal = document.querySelector("div#question-modal");
        this.deleteButtons = document.querySelectorAll("button[is='delete']");
        this.deleteBtn = this.questionModal.querySelector("button[is='delete-student']");
        this.closeButtons = this.questionModal.querySelectorAll("button[is='close']");
        this.modalMessage = this.questionModal.querySelector("div[is='message']");
    }

    private setListeners(){
        this.deleteButtons.forEach((btn)=>{
            let fullName = btn.closest('tr').querySelector('td').innerText;
            this.modalMessage.innerText = this.modalMessage.innerText.replace('@var@', fullName);

            btn.addEventListener('click',()=>{
                this.questionModal.classList.add("modal-active");
                this.deleteBtn.dataset.student = btn.dataset.student;
            });
        });
        this.closeButtons.forEach((btn)=>{
            btn.addEventListener('click',()=>{
                this.questionModal.classList.remove("modal-active");
            });
        });
        this.deleteBtn.addEventListener('click', this.deleteStudent);
    }

    private deleteStudent(ev:Event & {target: HTMLButtonElement}){
        let studentId = ev.target.dataset.student;
        $.ajax({
            url: '/student/delete/' + studentId,
            method: 'POST',
            success:function (data){
                location.reload();
            },
            error: function (data) {
                console.log(data);
            }
        })
    }

}
let deleteStudent = new DeleteStudent();
