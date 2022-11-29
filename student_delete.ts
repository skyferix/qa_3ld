
class DeleteStudentManger {
    private questionModalEl: HTMLDivElement;
    private deleteButtons: NodeListOf<HTMLButtonElement>;
    private deleteBtn: HTMLInputElement;
    private closeButtons: NodeListOf<HTMLButtonElement>;
    private modalMessage: HTMLDivElement;

    constructor() {
        this.setAttributes();
        this.setListeners();
    }

    private setAttributes() {
        this.questionModal = document.querySelector("div#question-modal");
        this.deleteButtons = document.querySelectorAll("button[is='delete']");
        this.deleteBtnEl = this.questionModalEl.querySelector("button[is='delete-student']");
        this.closeButtons = this.questionModalEl.querySelectorAll("button[is='close']");
        this.modalMessage = this.questionModalEl.querySelector("div[is='message']");
    }

    private setListeners() {
        this.deleteButtons.forEach((btn) => {
            const fullName = btn.closest('tr').querySelector('td').innerText;
            this.modalMessage.innerText = this.modalMessage.innerText.replace('@var@', fullName);

            btn.addEventListener('click',() => {
                this.questionModalEl.classList.add("modal-active");
                this.deleteBtn.dataset.student = btn.dataset.student;
            });
        });
        this.closeButtons.forEach((btn) => {
            btn.addEventListener('click',() => {
                this.questionModalEl.classList.remove("modal-active");
            });
        });
        this.deleteBtn.addEventListener('click', this.deleteStudent);
    }

    private deleteStudent(ev:Event & {target: HTMLButtonElement}) {
        const studentId = ev.target.dataset.student;
        $.ajax({
            url: `/student/delete/${studentId}`,
            method: 'POST',
            success: () => { location.reload(); }
        }).catch(error => throw error)
    }

}
const deleteStudent = new DeleteStudentManger();
