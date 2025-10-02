document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const pedido = {
            carrinho: JSON.parse(localStorage.getItem("carrinho")) || [],
            cliente: {
                nome: document.getElementById("name").value,
                email: document.getElementById("email").value,
                telefone: document.getElementById("phone").value,
                endereco: {
                    rua: document.getElementById("street").value,
                    apt: document.getElementById("apartment").value,
                    cidade: document.getElementById("city").value,
                    estado: document.getElementById("state").value,
                    cep: document.getElementById("zip").value
                },
                instrucoes: document.getElementById("instructions").value
            }
        };

        console.log("Pedido gerado:", pedido);

        // por enquanto apenas salva local
        localStorage.setItem("pedidoFinal", JSON.stringify(pedido));

        // redireciona para confirmação
        window.location.href = "confirmacao.html";
    });
});
