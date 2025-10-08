document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const submitMessage = document.getElementById("submitMessage");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Mostra mensagem enquanto o pedido é enviado
        submitMessage.style.display = "block";

        const requestType = document.querySelector('input[name="requestType"]:checked')?.value || "";

        const pedido = {
            dadosCliente: {
                organization: document.getElementById("organization").value,
                site: document.getElementById("site").value,
                nome: document.getElementById("name").value,
                email: document.getElementById("email").value,
                telefone: document.getElementById("phone").value,
                po: document.getElementById("po").value,
                requestType: requestType,
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
<h1>New Parts Request</h1>

<p><strong>Customer Data</strong><br>
Organization: ${pedido.dadosCliente.organization}<br>
Site: ${pedido.dadosCliente.site}<br>
Name: ${pedido.dadosCliente.nome}<br>
Email: ${pedido.dadosCliente.email}<br>
Phone: ${pedido.dadosCliente.telefone}<br>
PO: ${pedido.dadosCliente.po}<br>
Request Type: ${pedido.dadosCliente.requestType === "order" ? "I want to order these items" : "I want to quote these items"}</p>

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
                    subject: "AEI - Parts Request Confirmation",
                    message: message,
                    isHtml: true
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("pedidoFinal", JSON.stringify(pedido));
                localStorage.removeItem("carrinho");

                submitMessage.textContent = "Order submitted successfully!";
                submitMessage.style.backgroundColor = "#007bff"; 

                setTimeout(() => {
                    window.location.href = "confirmation.html";
                }, 1500);
            } else {
                alert("Something went wrong: " + (data?.body || response.statusText));
                submitMessage.style.display = "none";
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
            submitMessage.style.display = "none";
        }
    });
});
