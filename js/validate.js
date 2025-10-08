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

function validarRadio(name, elementoErro, mensagem) {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    const algumSelecionado = Array.from(radios).some(radio => radio.checked);

    if (!algumSelecionado) {
        elementoErro.textContent = mensagem;
        return false;
    }

    elementoErro.textContent = "";
    return true;
}


document.getElementById("organization").addEventListener("blur", function () {
    validarCampoObrigatorio(this, document.getElementById("erroOrganization"), "A company must be informed.");
});

document.getElementById("site").addEventListener("blur", function () {
    validarCampoObrigatorio(this, document.getElementById("erroSite"), "A site must be informed.");
});

document.getElementById("name").addEventListener("blur", function () {
    validarCampoObrigatorio(this, document.getElementById("erroContactName"), "A contact is mandatory.");
});

document.getElementById("email").addEventListener("blur", function () {
    validarEmail(this, document.getElementById("erroEmail"));
});

document.querySelector(".formulario").addEventListener("submit", function (event) {
    let organization = document.getElementById("organization");
    let contactName = document.getElementById("name");
    let email = document.getElementById("email");
    let site = document.getElementById("site");

    let erroOrganization = document.getElementById("erroOrganization");
    let erroContactName = document.getElementById("erroContactName");
    let erroEmail = document.getElementById("erroEmail");
    let erroSite = document.getElementById("erroSite");
    let erroRequestType = document.getElementById("erroRequestType");

    let orgValido = validarCampoObrigatorio(organization, erroOrganization, "A company must be informed.");
    let contactValido = validarCampoObrigatorio(contactName, erroContactName, "A contact is mandatory.");
    let emailValido = validarEmail(email, erroEmail);
    let siteValido = validarCampoObrigatorio(site, erroSite, "A site must be informed.");
    let radioValido = validarRadio("requestType", erroRequestType, "Please select a request type.");

    if (!orgValido || !siteValido || !contactValido || !emailValido || !radioValido) {
        event.preventDefault();
    }
});


const form = document.querySelector(".formulario");
const submitBtn = document.getElementById("submitBtn");

const organization = document.getElementById("organization");
const contactName = document.getElementById("name");
const email = document.getElementById("email");

function checarCampos() {
    const orgValido = organization.value.trim() !== "";
    const contactValido = contactName.value.trim() !== "";
    const emailValido = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value.trim());
    const radioValido = Array.from(document.querySelectorAll('input[name="requestType"]')).some(r => r.checked);

    submitBtn.disabled = !(orgValido && contactValido && emailValido && radioValido);
}


[organization, contactName, email].forEach(input => {
    input.addEventListener("input", () => {
        checarCampos();
    });
});

checarCampos();
