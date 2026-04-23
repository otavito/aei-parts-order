document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const submitMessage = document.getElementById("submitMessage");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        submitMessage.style.display = "block";
        submitMessage.textContent = "Submitting request...";

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
                }
            },
            carrinho: JSON.parse(localStorage.getItem("carrinho")) || {}
        };

        const items = Object.entries(pedido.carrinho).map(([item, qty]) => ({
            item,
            qty
        }));

        const shipmentAddress = [
            `${pedido.dadosCliente.endereco.rua}${pedido.dadosCliente.endereco.apt ? ", " + pedido.dadosCliente.endereco.apt : ""}`,
            `${pedido.dadosCliente.endereco.cidade} - ${pedido.dadosCliente.endereco.state}, ${pedido.dadosCliente.endereco.cep}`
        ].join("\n");

        try {
            const FUNCTION_URL = "https://partsorder-api-hne6dzfudubdfvg0.westus3-01.azurewebsites.net/api/sendEmail";

            const response = await fetch(FUNCTION_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: pedido.dadosCliente.email,
                    subject: "AEI - Parts Request Confirmation",
                    customerData: {
                        organization: pedido.dadosCliente.organization,
                        site: pedido.dadosCliente.site,
                        name: pedido.dadosCliente.nome,
                        email: pedido.dadosCliente.email,
                        phone: pedido.dadosCliente.telefone,
                        po: pedido.dadosCliente.po,
                        requestType: pedido.dadosCliente.requestType === "order"
                            ? "I want to order these items"
                            : "I want to quote these items"
                    },
                    items,
                    shipmentAddress
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
                alert("Something went wrong: " + (data?.error || data?.message || response.statusText));
                submitMessage.style.display = "none";
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
            submitMessage.style.display = "none";
        }
    });
});