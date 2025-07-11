// KovalBot para Calendario Familiar
async function sendChatbotMessage() {
    const input = document.getElementById('chatbot-input');
    const messages = document.getElementById('chatbot-messages');
    const userMessage = input.value.trim();
    if (!userMessage) return;
    
    messages.innerHTML += `<div><b>Tú:</b> ${userMessage}</div>`;
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
    
    try {
        // Include calendar context with the message
        const calendarContext = getCalendarContext();
        const messageWithContext = `Eres KovalBot, un asistente familiar inteligente que ayuda con el calendario y la organización familiar.

${calendarContext}

Instrucciones para respuestas:
- Responde de manera natural y conversacional en el mismo idioma que el usuario
- Sé conciso y directo
- Puedes ayudar con:
  * Consultar eventos próximos
  * Sugerir horarios para actividades
  * Recordar planes familiares
  * Dar consejos sobre menú semanal y cocina
  * Motivar con los mini-retos familiares
  * Responder preguntas sobre el calendario
  * Dar consejos de organización familiar
- Si el usuario pregunta por eventos específicos, menciona fecha, hora y miembro responsable
- Si pregunta por planes, incluye la prioridad y descripción
- Si pregunta sobre el menú, menciona los platos y tiempos de cocción
- Si pregunta sobre retos, motiva y da consejos para completarlos
- Mantén un tono amigable y útil

Pregunta del usuario: ${userMessage}`;
        
        const res = await fetch('https://kovalbot-backend.onrender.com/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: messageWithContext })
        });
        const data = await res.json();
        messages.innerHTML += `<div><b>KovalBot:</b> ${data.reply}</div>`;
        messages.scrollTop = messages.scrollHeight;
    } catch (err) {
        messages.innerHTML += `<div style="color:red;"><b>Error:</b> No se pudo conectar con el servidor del chatbot.</div>`;
        messages.scrollTop = messages.scrollHeight;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('chatbot-input').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') sendChatbotMessage();
    });
    
    // Ensure chatbot starts collapsed on all devices
    const chatbotBody = document.getElementById('chatbot-body');
    const chatbotHeader = document.getElementById('chatbot-header');
    if (chatbotBody && chatbotHeader) {
        chatbotBody.style.display = 'none';
        chatbotHeader.style.borderRadius = '10px';
    }
});

function toggleChatbot() {
    const chatbotBody = document.getElementById('chatbot-body');
    const chatbotHeader = document.getElementById('chatbot-header');
    
    if (chatbotBody.style.display === 'none') {
        chatbotBody.style.display = 'block';
        chatbotHeader.style.borderRadius = '10px 10px 0 0';
        chatbotBody.style.borderRadius = '0 0 10px 10px';
        
        // Add welcome message if empty
        const messages = document.getElementById('chatbot-messages');
        if (messages.innerHTML.trim() === '') {
            messages.innerHTML = '<div><b>KovalBot:</b> ¡Hola! Soy tu asistente familiar inteligente. Puedo ayudarte con el calendario, ideas de planes, menú semanal, mini-retos familiares y organización. ¿En qué puedo ayudarte?</div>';
        }
    } else {
        chatbotBody.style.display = 'none';
        chatbotHeader.style.borderRadius = '10px';
    }
}
