class UserController {
    constructor(formId, tableId){
        this.formEl  = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
    }

    onEdit(){
        document.querySelector(".btn-cancel").addEventListener("click", e=>{
            this.showPanelCreate();
        });
    }

    onSubmit(){
        this.formEl.addEventListener("submit", e =>{
            e.preventDefault();

            let btnSubmit = this.formEl.querySelector('[type=submit]');
            btnSubmit.disabled = true;

            let values = this.getValues()

            if(!values) return false; //Caso algum campo não seja preenchido
            
            this.getPhoto().then((content)=>{
                values.photo = content;
                this.addLine(values);
                this.formEl.reset();
                btnSubmit.disabled = false;
            },(e)=>{
                console.error(e);
            });
            
        });
    }

    getPhoto(){

        return new Promise((resolve,reject)=>{
            let fileReader = new FileReader;
            let elements = [...this.formEl.elements].filter(item=>{
                if (item.name === 'photo'){
                    return item;
                }
            });

            let file = elements[0].files[0];

            fileReader.onload = ()=>{
            
                resolve(fileReader.result);

            };

            fileReader.onerror = (e)=>{
                reject(e);
            };
            if(file){
                fileReader.readAsDataURL(file);
            }else{
                resolve('dist/img/boxed-bg.jpg');
            }
            
        });

        
    }

    getValues(){
        let user = {};
        let isValid = true;

        [...this.formEl.elements].forEach((field, index)=>{

            if(['name','email','password'].indexOf(field.name) > -1 && field.value == ''){
                field.parentElement.classList.add('has-error');
                isValid = false;
            }
            if(field.name == "gender"){
                if(field.checked){
                    user[field.name] = field.value;
                }  
            }else if (field.name == "admin"){
                user[field.name] = field.checked;
            }else {
                user[field.name] = field.value;
            }
        });

        if(!isValid){
            return false;
        }

        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );
    }
    
    addLine(users){

        let tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(users); //cria um dataset para armazenar as informações de usuário e converte o objeto para string
        
        tr.innerHTML = `
            <td><img src="${users.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${users.name}</td>
            <td>${users.email}</td>
            <td>${(users.admin) ? "Sim" : "Não"}</td>
            <td>${Utils.dateFormat(users.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-update btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.tableEl.appendChild(tr);

        this.updateCount();

        document.querySelector(".btn-update").addEventListener("click", e=>{
            this.showPanelUpdate();
        });
    }

    showPanelCreate(){
        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";
    }

    showPanelUpdate(){
        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";
    }


    updateCount(){
        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr=>{
            numberUsers++;

            let user = JSON.parse(tr.dataset.user); //recupera as informações de usuário guardadas no dataset e converte a string de volta para objeto

            if(user._admin) numberAdmin++;
        });

        document.querySelector('#number-users').innerHTML = numberUsers;
        document.querySelector('#number-users-admin').innerHTML = numberAdmin;
    }
}