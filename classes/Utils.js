class Utils{

    static dateFormat(date){
        return (date.getDate().toString().padStart(2,0) + "/" +
               (date.getMonth()+1).toString().padStart(2,0) + "/" + 
               date.getFullYear() + " " + 
               date.getHours().toString().padStart(2,0) + ":" + 
               date.getMinutes().toString().padStart(2,0)
               ).toLocaleString('pt-BR');
    }

    static requiredFieldError(){
        let requiredMsg = document.createElement('span');
        requiredMsg.classList.add('help-block');
        requiredMsg.innerHTML = 'Campo obrigatório!';

        return requiredMsg;
    }
}