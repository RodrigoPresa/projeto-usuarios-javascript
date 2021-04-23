var fields = document.querySelectorAll("#form-user-create [name]");
var user = {};

function addLine(users){

    document.getElementById("table-users").innerHTML = `
                    <tr>
                      <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
                      <td>${users.name}</td>
                      <td>${users.email}</td>
                      <td>${users.admin}</td>
                      <td>${users.birth}</td>
                      <td>
                        <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                      </td>
                    </tr>
    `;
}

document.getElementById("form-user-create").addEventListener("submit", function(e){
    e.preventDefault();
    fields.forEach((field, index)=>{
        //console.log(field.name);
        if(field.name == "gender"){
            if(field.checked){
                user[field.name] = field.value;
            }        
        }else {
            user[field.name] = field.value;
        }
    });
    addLine(user);
})

