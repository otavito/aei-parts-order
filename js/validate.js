function validarCampoObrigatorio(input, elementoErro, mensagem) {
    if (input.value.trim() === "") {
        elementoErro.textContent = mensagem;
        input.classList.add("input-error");
        return false;
    }
    elementoErro.textContent = "";
    input.classList.remove("input-error");
    return true;
}

function validarEmail(input, elementoErro) {
    let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (input.value.trim() === "") {
        elementoErro.textContent = "A e-mail address is mandatory.";
        input.classList.add("input-error");
        return false;
    } else if (!regexEmail.test(input.value)) {
        elementoErro.textContent = "Input a valid e-mail address.";
        input.classList.add("input-error");
        return false;
    }
    elementoErro.textContent = "";
    input.classList.remove("input-error");
    return true;
}

// Eventos blur (validação ao sair do campo)
document.getElementById("organization").addEventListener("blur", function() {
    validarCampoObrigatorio(this, document.getElementById("erroOrganization"), "A company must be informed.");
});

document.getElementById("name").addEventListener("blur", function() {
    validarCampoObrigatorio(this, document.getElementById("erroContactName"), "A contact is mandatory.");
});

document.getElementById("email").addEventListener("blur", function() {
    validarEmail(this, document.getElementById("erroEmail"));
});

// Validação final no submit
document.querySelector(".formulario").addEventListener("submit", function(event) {
    let organization = document.getElementById("organization");
    let contactName = document.getElementById("name");
    let email = document.getElementById("email");

    let erroOrganization = document.getElementById("erroOrganization");
    let erroContactName = document.getElementById("erroContactName");
    let erroEmail = document.getElementById("erroEmail");

    let orgValido = validarCampoObrigatorio(organization, erroOrganization, "A company must be informed.");
    let contactValido = validarCampoObrigatorio(contactName, erroContactName, "A contact is mandatory.");
    let emailValido = validarEmail(email, erroEmail);

    if (!orgValido || !contactValido || !emailValido) {
        event.preventDefault();
    }
});
