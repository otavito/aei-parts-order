const sgMail = require('@sendgrid/mail');

module.exports = async function (context, req) {
  try {
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@yourcompany.com';
    const SALES_EMAIL = process.env.SALES_EMAIL || 'sales@yourcompany.com';

    if (!SENDGRID_API_KEY) {
      context.log.error('SENDGRID_API_KEY not set');
      context.res = { status: 500, body: 'Email service not configured' };
      return;
    }

    sgMail.setApiKey(SENDGRID_API_KEY);

    const pedido = req.body;
    if (!pedido || !pedido.dadosCliente) {
      context.res = { status: 400, body: 'Invalid payload' };
      return;
    }

    const items = pedido.carrinho || {};
    const itemsHtml = Object.entries(items)
      .map(([nome, qtd]) => `<li>${nome} — ${qtd}</li>`)
      .join('');

    // email para o cliente
    const clienteHtml = `
      <p>Olá ${pedido.dadosCliente.nome || ''},</p>
      <p>Recebemos seu pedido. Itens:</p>
      <ul>${itemsHtml}</ul>
      <p>Endereço: ${pedido.dadosCliente.endereco?.rua || ''}, ${pedido.dadosCliente.endereco?.cidade || ''} ${pedido.dadosCliente.endereco?.state || ''} ${pedido.dadosCliente.endereco?.cep || ''}</p>
      <p>Obrigado — time AEI</p>
    `;

    const mensagens = [
      {
        to: pedido.dadosCliente.email,
        from: FROM_EMAIL,
        subject: 'Confirmação do seu pedido AEI',
        html: clienteHtml
      },
      {
        to: SALES_EMAIL,
        from: FROM_EMAIL,
        subject: 'Novo pedido recebido - AEI',
        html: `<h3>Novo pedido</h3><p>Cliente: ${pedido.dadosCliente.nome}</p><ul>${itemsHtml}</ul><pre>${JSON.stringify(pedido, null, 2)}</pre>`
      }
    ];

    await sgMail.send(mensagens);

    context.res = { status: 200, body: { ok: true } };
  } catch (err) {
    context.log.error(err);
    context.res = { status: 500, body: 'Erro ao enviar e-mail' };
  }
};
