import { ResponseType } from "./model";

class CreateStudentManager {
    private modal: HTMLInputElement;
    private createBtn: HTMLButtonElement;
    private saveBtn: HTMLInputElement;
    private closeButtons: NodeListOf<HTMLButtonElement>;
    private form: HTMLFormElement;

    constructor() {
        this.setAttributes();
        this.setListeners();
    }

    private setAttributes() {
        this.modal = document.querySelector('#create-modal');
        this.createBtn = document.querySelector('button#create');
        this.closeButtons = this.modal.querySelectorAll("button[is='close']");
        this.saveBtn = this.modal.querySelector("button#student_submit");
        this.form = this.modal.querySelector("form[name='student']");
    }

    private setListeners() {
        this.createBtn.addEventListener('click',()=>{
            this.modal.classList.add("modal-active");
        });
        this.closeButtons.forEach((button)=>{
            button.addEventListener('click', () => {
                this.modal.classList.remove("modal-active");
            });
        });
        this.form.addEventListener('submit', this.submitForm);
    }

    private submitForm(ev:Event & {target: HTMLButtonElement}) {
        ev.preventDefault();

        const form = $("form[name='student']");

        const formData = form.serialize();
        const url = window.location.href;
        const id = url.substr(url.lastIndexOf('/') + 1);
        $.post({
            url: `/student/create/${id}`,
            contentType: 'application/x-www-form-urlencoded',
            data: formData,
            success: () => {location.reload();},
            error: (data) => {
                if(data.status === ResponseType.CONSECTION_CLOSED) {
                    const errorDiv: HTMLDivElement = document.querySelector('div#UX_error');
                    errorDiv.innerText = errorDiv.innerText.replace('@var@', data.responseJSON.student_fullName);
                    errorDiv.classList.remove('d-none');
                }
            }
        })
    }

}
const createStudent = new CreateStudentManager();
