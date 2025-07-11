// KovalBot para Calendario Familiar

// Function to get calendar context for the chatbot
function getCalendarContext() {
    try {
        // Get current data from global variables (in memory) first, fallback to localStorage
        const eventsData = (typeof events !== 'undefined' && events.length > 0) ? events : JSON.parse(localStorage.getItem('familyEvents') || '[]');
        const plansData = (typeof plans !== 'undefined' && plans.length > 0) ? plans : JSON.parse(localStorage.getItem('familyPlans') || '[]');
        const menuData = (typeof weeklyMenu !== 'undefined' && Object.keys(weeklyMenu).length > 0) ? weeklyMenu : JSON.parse(localStorage.getItem('weeklyMenu') || '{}');
        const challengesData = (typeof challenges !== 'undefined' && challenges.length > 0) ? challenges : JSON.parse(localStorage.getItem('familyChallenges') || '[]');
        const inventoryData = (typeof inventory !== 'undefined' && inventory.length > 0) ? inventory : JSON.parse(localStorage.getItem('homeInventory') || '[]');
        
        // Add current date info
        const today = new Date();
        const todayString = today.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        let context = `FECHA ACTUAL: Hoy es ${todayString}\n\n`;
        
        // Add upcoming events
        const upcomingEvents = eventsData.filter(event => new Date(event.date) >= today)
                                   .sort((a, b) => new Date(a.date) - new Date(b.date))
                                   .slice(0, 5);
        
        if (upcomingEvents.length > 0) {
            context += "PRÓXIMOS EVENTOS:\n";
            upcomingEvents.forEach(event => {
                const date = new Date(event.date).toLocaleDateString('es-ES');
                context += `- ${event.title} (${event.member}) - ${date} a las ${event.time}\n`;
            });
            context += "\n";
        }
        
        // Add current plans
        if (plansData.length > 0) {
            context += "PLANES FAMILIARES:\n";
            plansData.slice(0, 3).forEach(plan => {
                context += `- ${plan.title} (Prioridad: ${plan.priority}) - ${plan.description}\n`;
            });
            context += "\n";
        }
        
        // Add current challenges
        const activeChallenges = challengesData.filter(c => c.status !== 'completed').slice(0, 3);
        if (activeChallenges.length > 0) {
            context += "MINI-RETOS ACTIVOS:\n";
            activeChallenges.forEach(challenge => {
                context += `- ${challenge.title} (${challenge.assignedTo}) - ${challenge.description}\n`;
            });
            context += "\n";
        }
        
        // Add weekly menu highlights
        const menuItems = Object.values(menuData).filter(item => item && item.dish);
        if (menuItems.length > 0) {
            context += "MENÚ SEMANAL:\n";
            menuItems.slice(0, 3).forEach(item => {
                context += `- ${item.dish} (${item.cookTime} min)\n`;
            });
            context += "\n";
        }
        
        // Add inventory items
        if (inventoryData.length > 0) {
            context += "INVENTARIO ACTUAL:\n";
            inventoryData.forEach(item => {
                context += `- ${item.name}: ${item.quantity} unidades (Categoría: ${item.category})\n`;
            });
            context += "\n";
        }
        
        return context || "No hay información específica del calendario disponible en este momento.";
    } catch (error) {
        console.error('Error getting calendar context:', error);
        return "Error al acceder a la información del calendario.";
    }
}

async function sendChatbotMessage() {
    const input = document.getElementById('chatbot-input');
    const messages = document.getElementById('chatbot-messages');
    const userMessage = input.value.trim();
    if (!userMessage) return;
    
    messages.innerHTML += `<div><b>Tú:</b> ${userMessage}</div>`;
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
    
    // Show loading indicator
    messages.innerHTML += `<div id="loading-message"><b>KovalBot:</b> <em>Escribiendo...</em></div>`;
    messages.scrollTop = messages.scrollHeight;
    
    try {
        // Include calendar context with the message
        const calendarContext = getCalendarContext();
        const messageWithContext = `Eres KovalBot, asistente del calendario familiar.

${calendarContext}

Instrucciones para respuestas:
- SIEMPRE usa la información exacta del contexto proporcionado arriba, especialmente la FECHA ACTUAL
- Si preguntan sobre inventario, consulta la sección "INVENTARIO ACTUAL" y da la cantidad exacta
- Si preguntan sobre eventos, consulta "PRÓXIMOS EVENTOS" y menciona fecha, hora y responsable
- Si preguntan sobre planes, consulta "PLANES FAMILIARES" con prioridad y descripción
- Si preguntan qué día es hoy, usa la fecha de la sección "FECHA ACTUAL"
- Si preguntan sobre cantidad de algo específico en inventario, busca el item exacto y di la cantidad
- Si no encuentras algo en el contexto, di claramente "No veo esa información en los datos actuales"
- Sé específico y usa los datos exactos del contexto
- Responde en español de manera amigable y útil
- Si preguntan sobre el menú, consulta "MENÚ SEMANAL"
- Si preguntan sobre retos, consulta "MINI-RETOS ACTIVOS"

Pregunta del usuario: ${userMessage}`;
        
        console.log('Enviando request a:', 'https://kovalbot-backend.onrender.com/chat');
        console.log('Con mensaje:', messageWithContext.substring(0, 200) + '...');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for Render cold start
        
        const res = await fetch('https://kovalbot-backend.onrender.com/chat', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ message: messageWithContext }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log('Response status:', res.status);
        console.log('Response headers:', res.headers);
        
        // Remove loading indicator
        const loadingMsg = document.getElementById('loading-message');
        if (loadingMsg) loadingMsg.remove();
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status} - ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log('Response data:', data);
        
        // Handle different response formats
        const botResponse = data.reply || data.response || data.message || data.answer || 
                           (typeof data === 'string' ? data : 'Respuesta recibida del servidor');
        
        messages.innerHTML += `<div><b>KovalBot:</b> ${botResponse}</div>`;
        messages.scrollTop = messages.scrollHeight;
    } catch (err) {
        console.error('Chatbot error:', err);
        
        // Remove loading indicator
        const loadingMsg = document.getElementById('loading-message');
        if (loadingMsg) loadingMsg.remove();
        
        let errorMessage = 'No se pudo conectar con el servidor del chatbot.';
        
        if (err.name === 'AbortError') {
            errorMessage = 'Timeout: El servidor tardó demasiado en responder. Puede estar iniciando, intenta de nuevo en unos segundos.';
        } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
            errorMessage = 'Error de red: Verifica tu conexión a internet.';
        } else if (err.message.includes('HTTP error! status: 502')) {
            errorMessage = 'El servidor está iniciando. Intenta de nuevo en 30-60 segundos.';
        } else if (err.message.includes('HTTP error! status: 503')) {
            errorMessage = 'El servidor está temporalmente no disponible. Intenta de nuevo en unos minutos.';
        } else if (err.message.includes('HTTP error')) {
            errorMessage = `Error del servidor: ${err.message}`;
        } else if (err.message.includes('CORS')) {
            errorMessage = 'Error de CORS: El servidor no permite esta conexión.';
        }
        
        messages.innerHTML += `<div style="color:red;"><b>Error:</b> ${errorMessage}</div>`;
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
            messages.innerHTML = '<div><b>KovalBot:</b> ¡Hola! Papá, Mamá, Samuel y Adaline, soy KovalBot. Puedo ayudarles con lo que necesiten. ¿En qué puedo ayudarte?</div>';
        }
    } else {
        chatbotBody.style.display = 'none';
        chatbotHeader.style.borderRadius = '10px';
    }
}
