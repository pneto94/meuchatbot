const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

exports.handler = async (event, context) => {
  try {
    const mensagem = JSON.parse(event.body);
    const usuario = mensagem.from;
    const texto = mensagem.text.body.toUpperCase();

    if (texto === 'PONTOELETRONICO') {
      // Lógica para exibir o menu inicial
      await enviarMensagemWhapi(usuario, 'Selecione uma opção:\n1. ENTRADA\n2. SAIDA_REFEICAO\n3. RETORNO_REFEICAO\n4. SAIDA');
    } else {
      // Lógica para processar as outras mensagens
      // ...
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'OK' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno do servidor' }),
    };
  }
};

async function enviarMensagemWhapi(telefone, mensagem) {
  // Implemente a lógica para enviar mensagens usando a API do Whapi
  // ...
}
