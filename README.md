<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chatbot Financeiro</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f2f5;
            margin: 0;
            padding: 20px;
        }
        #chatbox, #stockbox {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin-bottom: 20px;
        }
        #user-input, #stock-symbol, #file-input {
            width: calc(100% - 100px);
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 4px;
            border: 1px solid #ccc;
        }
        button {
            width: 100px;
            padding: 10px;
            border: none;
            border-radius: 4px;
            background-color: #007bff;
            color: white;
            cursor: pointer;
        }
        button:hover {
            background-color: #0056b3;
        }
        #messages {
            height: 300px;
            overflow-y: scroll;
            border: 1px solid #ccc;
            padding: 10px;
            margin-bottom: 10px;
            background-color: #fafafa;
            border-radius: 4px;
        }
        #stock-price {
            margin-top: 10px;
        }
        a {
            text-decoration: none;
            color: #007bff;
        }
    </style>
</head>
<body>
    <div id="chatbox">
        <div id="messages"></div>
        <input type="text" id="user-input" placeholder="Digite sua mensagem...">
        <button onclick="sendMessage()">Enviar</button>
        <input type="file" id="file-input">
        <button onclick="sendFile()">Enviar Arquivo</button>
        <button onclick="recordAudio()">Gravar Áudio</button>
    </div>
    <div id="stockbox">
        <input type="text" id="stock-symbol" placeholder="Digite o símbolo da ação...">
        <button onclick="getStockPrice()">Consultar</button>
        <div id="stock-price"></div>
    </div>
    <a href="https://app.emih.com.br/loja/Bankmetanoia">Visite Nosso Site</a>

    <script>
        window.onload = function() {
            const welcomeMessage = "Olá, me chamo Veltrix e fui criada por Patrick Roza para te ajudar com todos seus problemas financeiros. Você sabia que Patrick Roza escreveu um livro chamado 'Construindo um Futuro Financeiro Sólido'?";
            document.getElementById('messages').innerHTML += `<p><strong>Veltrix:</strong> ${welcomeMessage}</p>`;
        };

        async function sendMessage() {
            const userMessage = document.getElementById('user-input').value;
            document.getElementById('messages').innerHTML += `<p><strong>Você:</strong> ${userMessage}</p>`;
            try {
                const response = await fetch('http://127.0.0.1:5000/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: userMessage })
                });
                const data = await response.json();
                document.getElementById('messages').innerHTML += `<p><strong>IA:</strong> ${data.message}</p>`;
            } catch (error) {
                console.error('Erro ao enviar mensagem:', error);
                document.getElementById('messages').innerHTML += `<p><strong>Erro:</strong> Não foi possível enviar a mensagem.</p>`;
            }
            document.getElementById('user-input').value = '';
            document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
        }

        async function getStockPrice() {
            const symbol = document.getElementById('stock-symbol').value;
            try {
                const response = await fetch(`http://127.0.0.1:5000/stock/${symbol}`, {
                    method: 'GET'
                });
                const data = await response.json();
                if (data.error) {
                    document.getElementById('stock-price').innerHTML = `<p><strong>Erro:</strong> ${data.error}</p>`;
                } else {
                    document.getElementById('stock-price').innerHTML = `<p><strong>${data.symbol}:</strong> $${data.price}</p>`;
                }
            } catch (error) {
                console.error('Erro ao obter preço da ação:', error);
                document.getElementById('stock-price').innerHTML = `<p><strong>Erro:</strong> Não foi possível obter o preço da ação.</p>`;
            }
        }

        async function sendFile() {
            const fileInput = document.getElementById('file-input');
            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append('file', file);
            try {
                const response = await fetch('http://127.0.0.1:5000/upload', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                document.getElementById('messages').innerHTML += `<p><strong>IA:</strong> ${data.message}</p>`;
            } catch (error) {
                console.error('Erro ao enviar arquivo:', error);
                document.getElementById('messages').innerHTML += `<p><strong>Erro:</strong> Não foi possível enviar o arquivo.</p>`;
            }
        }

        function recordAudio() {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert('Seu navegador não suporta gravação de áudio.');
                return;
            }
            const constraints = { audio: true };
            navigator.mediaDevices.getUserMedia(constraints).then(stream => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();

                const audioChunks = [];
                mediaRecorder.addEventListener('dataavailable', event => {
                    audioChunks.push(event.data);
                });

                mediaRecorder.addEventListener('stop', () => {
                    const audioBlob = new Blob(audioChunks, { 'type': 'audio/wav' });
                    const formData = new FormData();
                    formData.append('audio', audioBlob);

                    fetch('http://127.0.0.1:5000/upload-audio', {
                        method: 'POST',
                        body: formData
                    }).then(response => response.json()).then(data => {
                        document.getElementById('messages').innerHTML += `<p><strong>IA:</strong> ${data.message}</p>`;
                    }).catch(error => {
                        console.error('Erro ao enviar áudio:', error);
                        document.getElementById('messages').innerHTML += `<p><strong>Erro:</strong> Não foi possível enviar o áudio.</p>`;
                    });
                });

                setTimeout(() => {
                    mediaRecorder.stop();
                }, 5000); // Grava por 5 segundos
            }).catch(error => {
                console.error('Erro ao acessar o microfone:', error);
                alert('Erro ao acessar o microfone: ' + error.message);
            });
        }
    </script>
</body>
</html>
