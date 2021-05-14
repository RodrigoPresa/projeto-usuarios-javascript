class UserController {
    constructor(formCreateId, formUpdateId, tableId){
        this.formEl  = document.getElementById(formCreateId);
        this.formUpdateEl  = document.getElementById(formUpdateId);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
        this.selectAll();
    }

    onEdit(){
        document.querySelector(".btn-cancel").addEventListener("click", e=>{
            this.showPanelCreate();
        });

        this.formUpdateEl.addEventListener("submit", e =>{
            e.preventDefault();

            let btnSubmit = this.formUpdateEl.querySelector('[type=submit]');
            btnSubmit.disabled = true;

            let values = this.getValues(this.formUpdateEl);
            
            let index = this.formUpdateEl.dataset.trIndex;
            let tr = this.tableEl.rows[index];
            let userOld = JSON.parse(tr.dataset.user);
            let result = Object.assign({}, userOld, values);            

            this.getPhoto(this.formUpdateEl).then((content)=>{

                if(!values._photo) {
                    result._photo = userOld._photo;
                } else{
                    result._photo = content;
                }

                let user = new User();
                user.loadFromJSON(result);
                user.save();

                this.getTr(user, tr);

                this.updateCount();                
                this.formUpdateEl.reset();
                btnSubmit.disabled = false;
                this.showPanelCreate();

            },(e)=>{
                console.error(e);
            });

            

        });      

    }

    onSubmit(){
        this.formEl.addEventListener("submit", e =>{
            e.preventDefault();

            let btnSubmit = this.formEl.querySelector('[type=submit]');
            btnSubmit.disabled = true;

            let values = this.getValues(this.formEl);

            if(!values) return false; //Caso algum campo não seja preenchido
            
            this.getPhoto(this.formEl).then((content)=>{
                values.photo = content;
                values.save();
                this.addLine(values);
                this.formEl.reset();
                btnSubmit.disabled = false;
            },(e)=>{
                console.error(e);
            });
            
        });
    }

    getPhoto(formEl){

        return new Promise((resolve,reject)=>{
            let fileReader = new FileReader;
            let elements = [...formEl.elements].filter(item=>{
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

    getValues(formEl){
        let user = {};
        let isValid = true;

        [...formEl.elements].forEach((field, index)=>{
            if(['name','email','password'].indexOf(field.name) > -1 && field.value == ''){
                field.parentElement.classList.add('has-error');
                field.after(Utils.requiredFieldError());
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

    selectAll(){ //seleciona as informações já armazenadas em local storage e adiciona as linhas na tela
        let users = User.getUsersStorage();

        users.forEach(dataUser=>{
            let user = new User();

            user.loadFromJSON(dataUser);

            this.addLine(user);
        });
    }
    
    addLine(users){

        let tr = this.getTr(users);

        this.tableEl.appendChild(tr);

        this.updateCount();
        
    }

    getTr(users, tr = null){
        if(tr === null) tr = document.createElement('tr');
        tr.dataset.user = JSON.stringify(users); //cria um dataset para armazenar as informações de usuário e converte o objeto para string
        
        tr.innerHTML = `
            <td><img src="${users.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${users.name}</td>
            <td>${users.email}</td>
            <td>${(users.admin) ? "Sim" : "Não"}</td>
            <td>${Utils.dateFormat(users.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-update btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.addEventsTr(tr);

        return tr;
    }

    addEventsTr(tr){

        tr.querySelector(".btn-delete").addEventListener("click", e=>{
            if(confirm("Deseja realmente excluir o usuário?")){

                let user = new User();
                user.loadFromJSON(JSON.parse(tr.dataset.user));
                user.remove();
                tr.remove();
                this.updateCount();
            }
        });

        tr.querySelector(".btn-update").addEventListener("click", e=>{
            let json = JSON.parse(tr.dataset.user);

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex; //Armazena o index da linha da tabela de update

            for(let name in json){
                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_" , "") + "]");
                
                if(field){
                    switch(field.type){
                        case 'file':
                            continue;
                            break;
                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_" , "") + "]" + "[value=" + json[name] + "]");
                            field.checked = true;
                            break;
                        case 'checkbox':
                            field.checked = json[name];
                            break;
                        default:
                            field.value = json[name];         
                    };
                    
                }

                this.formUpdateEl.querySelector(".photo").src = json._photo;

            }

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