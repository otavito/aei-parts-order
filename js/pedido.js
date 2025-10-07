document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const pedido = {
            dadosCliente: {
                organization: document.getElementById("organization").value,
                site: document.getElementById("site").value, // novo
                nome: document.getElementById("name").value,
                email: document.getElementById("email").value,
                telefone: document.getElementById("phone").value,
                po: document.getElementById("po").value, // novo
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
            .map(([nome, qtd]) => `<li>${nome} — ${qtd}</li>`)
            .join("");

        const message = `
    <h1>New Parts Order</h1>

    <p><strong>Customer Data</strong><br>
    Organization: ${pedido.dadosCliente.organization}<br>
    Site: ${pedido.dadosCliente.site}<br>
    Name: ${pedido.dadosCliente.nome}<br>
    Email: ${pedido.dadosCliente.email}<br>
    Phone: ${pedido.dadosCliente.telefone}<br>
    PO: ${pedido.dadosCliente.po}</p>

    <p><strong>Shipping Address</strong><br>
    ${pedido.dadosCliente.endereco.rua}, ${pedido.dadosCliente.endereco.apt || ""}<br>
    ${pedido.dadosCliente.endereco.cidade} - ${pedido.dadosCliente.endereco.state}, ${pedido.dadosCliente.endereco.cep}</p>

    <p><strong>Items Ordered</strong></p>
    <ul>${itemsHtml}</ul>

    <p><strong>Special Instructions</strong><br>
    ${pedido.dadosCliente.instrucoes || "None"}</p>
`;

        try {
            const FUNCTION_URL = "https://partsorder-api-hne6dzfudubdfvg0.westus3-01.azurewebsites.net/api/sendEmail";

            const response = await fetch(FUNCTION_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: pedido.dadosCliente.email,
                    subject: "AEI - Parts Order Confirmation",
                    message: message,
                    isHtml: true
                })
            });

            window.location.href = "confirmation.html";
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("pedidoFinal", JSON.stringify(pedido));
                localStorage.removeItem("carrinho");
            }
            else {
                alert("Something went wrong: " + (data?.body || response.statusText));
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        }
    });
});
