document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const pedido = {
            dadosCliente: {
                nome: document.getElementById("name").value,
                email: document.getElementById("email").value,
                telefone: document.getElementById("phone").value,
                endereco: {
                    rua: document.getElementById("street").value,
                    apt: document.getElementById("apartment").value,
                    cidade: document.getElementById("city").value,
                    state: document.getElementById("state").value,
                    cep: document.getElementById("zip").value
                },
                instrucoes: document.getElementById("instructions").value
            },
            carrinho: JSON.parse(localStorage.getItem("carrinho")) || {}
        };

        const itemsHtml = Object.entries(pedido.carrinho)
            .map(([nome, qtd]) => `${nome} — ${qtd}`)
            .join("\n");

        const message = `
Novo pedido AEI:

Cliente: ${pedido.dadosCliente.nome}
Email: ${pedido.dadosCliente.email}
Telefone: ${pedido.dadosCliente.telefone}

Endereço:
${pedido.dadosCliente.endereco.rua}, ${pedido.dadosCliente.endereco.apt || ""}
${pedido.dadosCliente.endereco.cidade} - ${pedido.dadosCliente.endereco.state}, ${pedido.dadosCliente.endereco.cep}

Itens:
${itemsHtml}

Instruções especiais:
${pedido.dadosCliente.instrucoes || "Nenhuma"}
    `;

        try {
            const FUNCTION_URL = "https://partsorder-api-hne6dzfudubdfvg0.westus3-01.azurewebsites.net/api/sendEmail";

            const response = await fetch(FUNCTION_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: pedido.dadosCliente.email,
                    subject: "AEI - Confirmação do seu pedido",
                    message: message
                })
            });


            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("pedidoFinal", JSON.stringify(pedido));
                window.location.href = "confirmacao.html";
            } else {
                alert("Falha ao enviar o pedido: " + (data?.body || response.statusText));
            }
        } catch (err) {
            console.error(err);
            alert("Erro ao enviar o pedido.");
        }
    });
});
