async function sendMessage() {
    const userMessage = document.getElementById('user-input').value;
    document.getElementById('messages').innerHTML += `<p><strong>Você:</strong> ${userMessage}</p>`;
    const response = await fetch('http://127.0.0.1:5000/chat', {  // Substitua 'http://127.0.0.1:5000' pela URL do seu backend
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
    });
    const data = await response.json();
    document.getElementById('messages').innerHTML += `<p><strong>IA:</strong> ${data.message}</p>`;
    document.getElementById('user-input').value = '';
    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
}

async function getStockPrice() {
    const symbol = document.getElementById('stock-symbol').value;
    const response = await fetch(`http://127.0.0.1:5000/stock/${symbol}`, {  // Substitua 'http://127.0.0.1:5000' pela URL do seu backend
        method: 'GET'
    });
    const data = await response.json();
    if (data.error) {
        document.getElementById('stock-price').innerHTML = `<p><strong>Erro:</strong> ${data.error}</p>`;
    } else {
        document.getElementById('stock-price').innerHTML = `<p><strong>${data.symbol}:</strong> $${data.price}</p>`;
    }
}
