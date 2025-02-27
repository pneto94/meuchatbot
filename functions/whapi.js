const admin = require('firebase-admin');
const axios = require('axios');

// Inicialize o Firebase Admin SDK com suas credenciais
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

exports.handler = async (event) => {
  try {
    console.log('Tipo do Payload:', typeof event.body);
    console.log('Payload recebido:', event.body);
    console.log('Cabeçalhos recebidos:', event.headers);

    const data = JSON.parse(event.body);
    console.log('Dados do payload:', data);

    const message = data.messages[0];
    const text = message.text.body;
    const chatId = message.chat_id;

    if (text === 'pontoeletronico') {
      const response = await axios.post(
        process.env.WHAPI_URL + '/messages',
        {
          messages: [
            {
              to: chatId,
              type: 'text',
              text: {
                body: 'Horário registrado com sucesso!',
              },
            },
          ],
        },
        {
          headers: {
            Authorization: 'Bearer ' + process.env.WHAPI_TOKEN,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Resposta do Whapi:', response.data);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Função executada com sucesso' }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Mensagem não processada' }),
      };
    }
  } catch (error) {
    console.error('Erro:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao processar a requisição' }),
    };
  }
};
