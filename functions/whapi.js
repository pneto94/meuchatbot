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

    let payload = event.body;

    // Tente converter para string se for um buffer
    if (typeof payload !== 'string') {
      payload = payload.toString();
    }

    // Tente decodificar explicitamente usando UTF-8
    payload = Buffer.from(payload, 'binary').toString('utf8');

    // Remova espaços em branco e caracteres de controle
    payload = payload.trim();

    // Verifique se o payload não está vazio
    if (!payload) {
      console.error('Payload vazio ou nulo');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Payload vazio ou nulo' }),
      };
    }

    const data = JSON.parse(payload);
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
