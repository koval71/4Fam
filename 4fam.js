// Calendario Familiar - JavaScript
// Data storage - Will be loaded from JSONBin
let events = [];
let plans = [];

// Weekly Menu Data and Functions
let weeklyMenu = [];
let shoppingList = [];
let favoriteLists = [];

// Inventory Data
let inventory = [];

// Mini Challenges Data and Functions
let challenges = [];
let currentChallenge = null;
let completedChallenges = [];
let familyScore = 0;
let customChallenges = [];
let modifiedChallenges = [];
let deletedChallenges = [];

// Current calendar state
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Member colors
const memberColors = {
    'Papa': '#3498db',
    'Mama': '#e74c3c',
    'Sam': '#2ecc71',
    'Ada': '#f39c12',
    'Familia': '#9b59b6'
};

// Recipe database for suggestions
const recipeDatabase = {
  breakfast: [
    // Recetas familiares favoritas
    { name: "Avena Tradicional", time: 10, ingredients: ["avena", "leche", "sal", "canela"], babySafe: true, description: "Avena cremosa y nutritiva, perfecta para empezar el día" },
    { name: "Farina con Leche", time: 8, ingredients: ["farina", "leche", "sal", "mantequilla"], babySafe: true, description: "Desayuno cremoso y reconfortante" },
    { name: "Harina de Maíz", time: 12, ingredients: ["harina de maíz", "leche", "sal", "azúcar"], babySafe: true, description: "Desayuno tradicional y sustancioso" },
    { name: "Huevos Hervidos", time: 8, ingredients: ["huevos", "sal"], babySafe: false, description: "Proteína simple y saludable" },
    
    // Recetas existentes
    { name: "Tostadas con Aguacate", time: 10, ingredients: ["pan", "aguacate", "sal"], babySafe: true, description: "Tostadas nutritivas y rápidas" },
    { name: "Smoothie de Frutas", time: 5, ingredients: ["banana", "fresas", "yogurt"], babySafe: true, description: "Smoothie refrescante y saludable" },
    { name: "Avena con Frutas", time: 15, ingredients: ["avena", "leche", "frutas"], babySafe: true, description: "Desayuno energético y completo" },
    { name: "Huevos Revueltos", time: 8, ingredients: ["huevos", "mantequilla", "sal"], babySafe: false, description: "Proteína rápida para empezar el día" },
    { name: "Tostadas Francesas", time: 12, ingredients: ["pan", "huevos", "leche"], babySafe: false, description: "Desayuno clásico y delicioso" },
    { name: "Panqueques Simples", time: 15, ingredients: ["huevos", "leche", "harina"], babySafe: false, description: "Panqueques esponjosos y ricos" },
    { name: "Cereal con Leche", time: 2, ingredients: ["cereal", "leche"], babySafe: true, description: "Desayuno rápido y fácil" },
    { name: "Pan Tostado Simple", time: 3, ingredients: ["pan", "mantequilla"], babySafe: true, description: "Tostadas básicas con mantequilla" }
  ],
  lunch: [
    // Recetas familiares favoritas
    { name: "Risotto de Camarones", time: 35, ingredients: ["arroz arborio", "camarones", "caldo de pescado", "vino blanco", "cebolla"], babySafe: false, description: "Risotto cremoso con camarones frescos" },
    { name: "Risotto de Salmón", time: 35, ingredients: ["arroz arborio", "salmón", "caldo de pescado", "vino blanco", "mantequilla"], babySafe: false, description: "Risotto elegante con salmón rosado" },
    { name: "Risotto de Setas", time: 30, ingredients: ["arroz arborio", "setas mixtas", "caldo de verduras", "vino blanco", "queso parmesano"], babySafe: false, description: "Risotto vegetariano con hongos aromáticos" },
    { name: "Arroz con Salmón", time: 25, ingredients: ["arroz", "salmón", "verduras", "aceite de oliva", "limón"], babySafe: false, description: "Arroz nutritivo con salmón al horno" },
    { name: "Arroz con Camarones", time: 20, ingredients: ["arroz", "camarones", "pimientos", "cebolla", "ajo"], babySafe: false, description: "Arroz sabroso con camarones y vegetales" },
    { name: "Arroz con Tofu", time: 18, ingredients: ["arroz", "tofu", "verduras mixtas", "salsa de soja", "jengibre"], babySafe: true, description: "Arroz vegetariano con tofu marinado" },
    
    // Recetas existentes
    { name: "Ensalada César", time: 15, ingredients: ["lechuga", "pollo", "queso"], babySafe: false, description: "Ensalada clásica y nutritiva" },
    { name: "Pasta con Tomate", time: 20, ingredients: ["pasta", "tomate", "albahaca"], babySafe: true, description: "Pasta simple y deliciosa" },
    { name: "Sándwich Club", time: 10, ingredients: ["pan", "jamón", "queso", "lechuga"], babySafe: true, description: "Sándwich completo y rápido" },
    { name: "Sopa de Verduras", time: 25, ingredients: ["verduras mixtas", "caldo"], babySafe: true, description: "Sopa reconfortante y saludable" },
    { name: "Sándwich de Huevo", time: 8, ingredients: ["pan", "huevos", "mantequilla"], babySafe: false, description: "Sándwich proteico y rápido" },
    { name: "Quesadillas Simples", time: 10, ingredients: ["tortillas", "queso"], babySafe: true, description: "Almuerzo rápido y satisfactorio" },
    { name: "Tortilla Española", time: 20, ingredients: ["huevos", "papas", "aceite"], babySafe: false, description: "Tortilla clásica española" }
  ],
  dinner: [
    // Recetas familiares favoritas para cena
    { name: "Risotto de Camarones (Cena)", time: 35, ingredients: ["arroz arborio", "camarones", "caldo de pescado", "vino blanco", "cebolla", "perejil"], babySafe: false, description: "Risotto cremoso con camarones, perfecto para una cena elegante" },
    { name: "Risotto de Salmón (Cena)", time: 35, ingredients: ["arroz arborio", "salmón", "caldo de pescado", "vino blanco", "mantequilla", "eneldo"], babySafe: false, description: "Risotto refinado con salmón para una cena especial" },
    { name: "Risotto de Setas (Cena)", time: 30, ingredients: ["arroz arborio", "setas mixtas", "caldo de verduras", "vino blanco", "queso parmesano", "trufa"], babySafe: false, description: "Risotto gourmet con setas variadas para una cena sofisticada" },
    { name: "Arroz con Salmón (Cena)", time: 25, ingredients: ["arroz", "salmón", "espárragos", "aceite de oliva", "limón"], babySafe: false, description: "Arroz con salmón al horno, acompañado de vegetales" },
    { name: "Arroz con Camarones (Cena)", time: 20, ingredients: ["arroz", "camarones", "pimientos", "cebolla", "ajo", "vino"], babySafe: false, description: "Arroz con camarones salteados y un toque de vino" },
    { name: "Arroz con Tofu (Cena)", time: 18, ingredients: ["arroz integral", "tofu", "brócoli", "salsa de soja", "jengibre", "sésamo"], babySafe: true, description: "Cena vegetariana saludable con tofu y vegetales" },
    
    // Recetas existentes
    { name: "Pollo a la Plancha", time: 25, ingredients: ["pollo", "limón", "hierbas"], babySafe: false, description: "Proteína ligera y sabrosa" },
    { name: "Pasta Alfredo", time: 20, ingredients: ["pasta", "crema", "queso"], babySafe: true, description: "Pasta cremosa y reconfortante" },
    { name: "Tacos de Pollo", time: 30, ingredients: ["tortillas", "pollo", "verduras"], babySafe: true, description: "Cena divertida y personalizable" },
    { name: "Risotto de Champiñones", time: 35, ingredients: ["arroz", "champiñones", "caldo"], babySafe: false, description: "Plato elegante y cremoso" },
    { name: "Huevos con Papas", time: 15, ingredients: ["huevos", "papas", "aceite"], babySafe: false, description: "Cena simple y nutritiva" },
    { name: "Pasta con Huevo", time: 12, ingredients: ["pasta", "huevos", "queso"], babySafe: false, description: "Pasta rápida estilo carbonara" },
    { name: "Sopa de Pan", time: 20, ingredients: ["pan", "caldo", "huevos"], babySafe: false, description: "Sopa reconfortante con pan" }
  ],
  snack: [
    { name: "Frutas con Yogurt", time: 3, ingredients: ["frutas", "yogurt"], babySafe: true, description: "Merienda saludable y rápida" },
    { name: "Galletas de Avena", time: 5, ingredients: ["galletas", "avena"], babySafe: true, description: "Snack energético casero" },
    { name: "Hummus con Verduras", time: 5, ingredients: ["hummus", "zanahoria", "apio"], babySafe: true, description: "Merienda nutritiva y colorida" },
    { name: "Pan con Mantequilla", time: 2, ingredients: ["pan", "mantequilla"], babySafe: true, description: "Merienda simple y rápida" },
    { name: "Leche con Galletas", time: 3, ingredients: ["leche", "galletas"], babySafe: true, description: "Merienda clásica" }
  ]
};

// Challenge database
const challengeDatabase = [
  { 
    id: 1, category: "no-screen", title: "1 Hora Sin Pantallas", 
    description: "Pasen 1 hora completa sin televisión, tablets, o teléfonos. ¡Descubran qué pueden hacer juntos!", 
    points: 10, duration: "1 hora", difficulty: "Fácil"
  },
  { 
    id: 2, category: "creative", title: "Picnic Casero", 
    description: "Hagan un picnic en la sala o jardín con mantas, comida especial y juegos.", 
    points: 15, duration: "2 horas", difficulty: "Fácil"
  },
  { 
    id: 3, category: "creative", title: "Juego Nuevo Sin Juguetes", 
    description: "Inventen un juego usando solo objetos de la casa (no juguetes).", 
    points: 20, duration: "30 min", difficulty: "Medio"
  },
  { 
    id: 4, category: "cooking", title: "Chef Familiar", 
    description: "Cocinen algo juntos donde cada miembro tenga una tarea específica.", 
    points: 25, duration: "1 hora", difficulty: "Medio"
  },
  { 
    id: 5, category: "active", title: "Baile en Familia", 
    description: "15 minutos de baile libre con música que le guste a todos.", 
    points: 10, duration: "15 min", difficulty: "Fácil"
  },
  { 
    id: 6, category: "creative", title: "Teatro Casero", 
    description: "Cada miembro representa un personaje e improvisen una historia.", 
    points: 20, duration: "45 min", difficulty: "Medio"
  },
  { 
    id: 7, category: "no-screen", title: "Noche de Cuentos", 
    description: "Una hora contando historias inventadas, cada uno aporta una parte.", 
    points: 15, duration: "1 hora", difficulty: "Fácil"
  },
  { 
    id: 8, category: "active", title: "Gimnasio Casero", 
    description: "Ejercicios simples que todos puedan hacer en casa por 20 minutos.", 
    points: 15, duration: "20 min", difficulty: "Fácil"
  },
  { 
    id: 9, category: "creative", title: "Arte con Materiales Reciclados", 
    description: "Crear algo artístico usando solo materiales que iban a tirar.", 
    points: 25, duration: "1 hora", difficulty: "Medio"
  },
  { 
    id: 10, category: "cooking", title: "Postres Sin Horno", 
    description: "Hacer un postre delicioso que no necesite cocción.", 
    points: 20, duration: "45 min", difficulty: "Medio"
  },
  { 
    id: 11, category: "no-screen", title: "Día de Juegos de Mesa", 
    description: "Dediquen 2 horas a juegos de mesa o cartas sin interrupciones.", 
    points: 20, duration: "2 horas", difficulty: "Fácil"
  },
  { 
    id: 12, category: "active", title: "Carrera de Obstáculos Casera", 
    description: "Creen un circuito con cojines, sillas y objetos seguros de la casa.", 
    points: 25, duration: "45 min", difficulty: "Medio"
  },
  { 
    id: 13, category: "creative", title: "Show de Talentos Familiar", 
    description: "Cada miembro presenta un talento especial (cantar, contar chistes, etc.).", 
    points: 20, duration: "1 hora", difficulty: "Fácil"
  },
  { 
    id: 14, category: "cooking", title: "Pizza Casera Personalizada", 
    description: "Hagan pizza desde cero, cada uno con sus ingredientes favoritos.", 
    points: 30, duration: "1.5 horas", difficulty: "Medio"
  },
  { 
    id: 15, category: "no-screen", title: "Búsqueda del Tesoro", 
    description: "Organicen una búsqueda del tesoro por toda la casa con pistas.", 
    points: 25, duration: "1 hora", difficulty: "Medio"
  },
  { 
    id: 16, category: "creative", title: "Construir un Fuerte", 
    description: "Usen sábanas, almohadas y muebles para hacer un fuerte familiar.", 
    points: 20, duration: "45 min", difficulty: "Fácil"
  },
  { 
    id: 17, category: "active", title: "Yoga Familiar", 
    description: "30 minutos de yoga o stretching que todos puedan seguir.", 
    points: 15, duration: "30 min", difficulty: "Fácil"
  },
  { 
    id: 18, category: "cooking", title: "Smoothies Creativos", 
    description: "Experimenten con combinaciones únicas de frutas y verduras.", 
    points: 15, duration: "30 min", difficulty: "Fácil"
  },
  { 
    id: 19, category: "no-screen", title: "Karaoke Sin Tecnología", 
    description: "Canten sus canciones favoritas sin micrófono ni pantallas.", 
    points: 15, duration: "45 min", difficulty: "Fácil"
  },
  { 
    id: 20, category: "creative", title: "Sesión de Fotos Temática", 
    description: "Elijan un tema y tomen fotos creativas con disfraces caseros.", 
    points: 20, duration: "1 hora", difficulty: "Fácil"
  },
  { 
    id: 21, category: "active", title: "Maratón de Caminata Interior", 
    description: "Caminen por la casa durante 30 minutos conversando.", 
    points: 10, duration: "30 min", difficulty: "Fácil"
  },
  { 
    id: 22, category: "cooking", title: "Concurso de Sándwiches", 
    description: "Cada uno crea el sándwich más creativo con ingredientes disponibles.", 
    points: 20, duration: "45 min", difficulty: "Fácil"
  },
  { 
    id: 23, category: "creative", title: "Mural Familiar", 
    description: "Dibujen un mural grande en papel donde todos contribuyan.", 
    points: 25, duration: "1.5 horas", difficulty: "Medio"
  },
  { 
    id: 24, category: "no-screen", title: "Noche de Adivinanzas", 
    description: "45 minutos de adivinanzas, acertijos y trabalenguas.", 
    points: 15, duration: "45 min", difficulty: "Fácil"
  },
  { 
    id: 25, category: "active", title: "Competencia de Limpieza", 
    description: "Conviertan la limpieza en un juego con música y premios simbólicos.", 
    points: 20, duration: "30 min", difficulty: "Fácil"
  }
];

// Initialize app
document.addEventListener('DOMContentLoaded', async function() {
    // Load data from JSONBin first
    await initializeApp();
    requestNotificationPermission();
    checkUpcomingEvents();
    setInterval(checkUpcomingEvents, 60000); // Check every minute
});

async function initializeApp() {
    try {
        // Load data from JSONBin
        console.log('🔄 Inicializando aplicación con datos de JSONBin...');
        await JSONBinAPI.syncData(true); // Force sync on initialization
        
        // Silent sync - no notification needed
        console.log('✅ Datos sincronizados exitosamente');
    } catch (error) {
        console.error('⚠️ Error cargando datos de JSONBin, usando datos locales:', error);
        showNotification('⚠️ Modo offline - usando datos locales', 'warning');
    }
    
    // Only initialize calendar functions if calendar elements exist
    if (document.getElementById('calendarGrid')) {
        renderCalendar();
        renderEvents();
        updateCurrentMonthDisplay();
        
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('eventDate');
        if (dateInput) dateInput.value = today;
        
        // Set default time to current time in 12-hour format
        const now = new Date();
        const currentHour24 = now.getHours();
        const currentMinute = now.getMinutes() >= 30 ? '30' : '00';
        
        // Convert to 12-hour format
        const time12 = convertTo12Hour(`${currentHour24.toString().padStart(2, '0')}:${currentMinute}`);
        
        const hourInput = document.getElementById('eventHour');
        const minuteInput = document.getElementById('eventMinute');
        const ampmInput = document.getElementById('eventAmPm');
        
        if (hourInput) hourInput.value = time12.hour;
        if (minuteInput) minuteInput.value = time12.minute;
        if (ampmInput) ampmInput.value = time12.ampm;
    }
    
    // Only initialize plans functions if plans elements exist
    if (document.getElementById('plansList')) {
        renderPlans();
    }
    
    // Only initialize inventory functions if inventory elements exist
    if (document.getElementById('inventoryList')) {
        renderInventory();
    }
    
    // Only initialize challenges functions if challenges elements exist
    if (document.getElementById('currentChallenge')) {
        initializeChallenges();
    }
    
    // Setup event listeners for elements that exist
    setupEventListeners();
}

function setupEventListeners() {
    // Event form (Calendar page)
    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', handleEventSubmit);
    }
    
    // Plan form (Ideas page)
    const planForm = document.getElementById('planForm');
    if (planForm) {
        planForm.addEventListener('submit', handlePlanSubmit);
    }
    
    // Inventory form (Inventario page)
    const inventoryForm = document.getElementById('inventoryForm');
    if (inventoryForm) {
        inventoryForm.addEventListener('submit', handleInventorySubmit);
    }
    
    // Custom challenge form (Retos page)
    const customChallengeForm = document.getElementById('customChallengeForm');
    if (customChallengeForm) {
        customChallengeForm.addEventListener('submit', handleCustomChallengeSubmit);
    }
}

// Tab management
// Utility functions for time conversion
function convertTo24Hour(hour12, minute, ampm) {
    let hour24 = parseInt(hour12);
    if (ampm === 'AM' && hour24 === 12) {
        hour24 = 0;
    } else if (ampm === 'PM' && hour24 !== 12) {
        hour24 += 12;
    }
    return `${hour24.toString().padStart(2, '0')}:${minute}`;
}

function convertTo12Hour(time24) {
    const [hours, minutes] = time24.split(':');
    let hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    
    if (hour === 0) {
        hour = 12;
    } else if (hour > 12) {
        hour -= 12;
    }
    
    return {
        hour: hour.toString(),
        minute: minutes,
        ampm: ampm
    };
}

// Event management
function handleEventSubmit(e) {
    e.preventDefault();
    
    // Validate time selection
    const hour = document.getElementById('eventHour').value;
    const minute = document.getElementById('eventMinute').value;
    const ampm = document.getElementById('eventAmPm').value;
    
    if (!hour || !minute || !ampm) {
        showNotification('Por favor selecciona hora, minutos y AM/PM', 'error');
        return false;
    }
    
    // Convert to 24-hour format for storage
    const time24 = convertTo24Hour(hour, minute, ampm);
    
    const eventData = {
        id: Date.now(),
        member: document.getElementById('eventMember').value,
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value,
        time: time24,
        description: document.getElementById('eventDescription').value,
        created: new Date().toISOString()
    };
    
    console.log('Adding event:', eventData);
    
    events.push(eventData);
    saveEvents();
    
    console.log('Total events after adding:', events.length);
    
    // Force re-render
    setTimeout(() => {
        renderCalendar();
        renderEvents();
    }, 100);
    
    // Clear form
    document.getElementById('eventForm').reset();
    
    // Show success message
    showNotification(`Evento "${eventData.title}" agregado para ${eventData.member}`, 'success');
    
    return false;
}

function deleteEvent(eventId) {
    console.log('deleteEvent llamada con ID:', eventId);
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
        events = events.filter(event => event.id !== eventId);
        saveEvents();
        renderCalendar();
        renderEvents();
        showNotification('Evento eliminado', 'info');
        console.log('Evento eliminado:', eventId);
    } else {
        console.log('Eliminación cancelada por el usuario');
    }
}

function editEvent(eventId) {
    console.log('editEvent llamada con ID:', eventId);
    const event = events.find(e => e.id === eventId);
    if (event) {
        console.log('Evento encontrado:', event);
        // Pre-fill form with event data
        document.getElementById('eventMember').value = event.member;
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDate').value = event.date;
        
        // Convert time to 12-hour format for display
        const time12 = convertTo12Hour(event.time);
        document.getElementById('eventHour').value = time12.hour;
        document.getElementById('eventMinute').value = time12.minute;
        document.getElementById('eventAmPm').value = time12.ampm;
        
        document.getElementById('eventDescription').value = event.description || '';
        
        // Change submit button to update mode
        const form = document.getElementById('eventForm');
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.textContent = '✏️ Actualizar';
        submitButton.setAttribute('data-editing', eventId);
        
        // Add cancel button
        let cancelButton = form.querySelector('.btn-cancel-edit');
        if (!cancelButton) {
            cancelButton = document.createElement('button');
            cancelButton.type = 'button';
            cancelButton.className = 'btn-cancel-edit btn-secondary';
            cancelButton.textContent = '❌ Cancelar';
            cancelButton.style.marginLeft = '10px';
            cancelButton.onclick = cancelEditEvent;
            submitButton.parentNode.appendChild(cancelButton);
        }
        cancelButton.style.display = 'inline-block';
        
        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('eventTitle').focus();
        
        showNotification(`Editando evento: ${event.title}`, 'info');
        console.log('Modo de edición activado para evento:', event.title);
    } else {
        console.error('Evento no encontrado con ID:', eventId);
    }
}

function cancelEditEvent() {
    const form = document.getElementById('eventForm');
    const submitButton = form.querySelector('button[type="submit"]');
    const cancelButton = form.querySelector('.btn-cancel-edit');
    
    // Reset form
    form.reset();
    
    // Reset button
    submitButton.textContent = 'Agregar';
    submitButton.removeAttribute('data-editing');
    
    // Hide cancel button
    if (cancelButton) {
        cancelButton.style.display = 'none';
    }
    
    // Reset default date and time
    setDefaultDateTime();
    
    showNotification('Edición cancelada', 'info');
}

// Calendar rendering
function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    if (!grid) {
        console.log('Calendar grid not found, skipping calendar render');
        return;
    }
    
    grid.innerHTML = '';
    
    // Days of week header
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.style.fontWeight = 'bold';
        dayHeader.style.padding = '10px 5px';
        dayHeader.style.backgroundColor = '#b76e79';
        dayHeader.style.color = 'white';
        dayHeader.style.borderRadius = '6px';
        dayHeader.textContent = day;
        grid.appendChild(dayHeader);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Create calendar days
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = createCalendarDay(date);
        grid.appendChild(dayElement);
    }
}

function createCalendarDay(date) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    
    const isToday = date.toDateString() === new Date().toDateString();
    const isCurrentMonth = date.getMonth() === currentMonth;
    
    if (isToday) dayElement.classList.add('today');
    if (!isCurrentMonth) dayElement.classList.add('other-month');
    
    // Day number
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = date.getDate();
    dayElement.appendChild(dayNumber);
    
    // Events for this day
    const dayEvents = document.createElement('div');
    dayEvents.className = 'day-events';
    
    const dayString = date.toISOString().split('T')[0];
    const dayEventsList = events.filter(event => event.date === dayString);
    
    dayEventsList.slice(0, 3).forEach(event => {
        const eventDot = document.createElement('div');
        eventDot.className = `event-dot ${event.member.toLowerCase()}`;
        
        // Convert time to 12-hour format for tooltip
        const time12 = convertTo12Hour(event.time);
        const displayTime = `${time12.hour}:${time12.minute} ${time12.ampm}`;
        eventDot.title = `${displayTime} - ${event.title} (${event.member})`;
        
        dayEvents.appendChild(eventDot);
    });
    
    if (dayEventsList.length > 3) {
        const moreDot = document.createElement('div');
        moreDot.className = 'event-dot';
        moreDot.style.background = '#999';
        moreDot.title = `+${dayEventsList.length - 3} más`;
        dayEvents.appendChild(moreDot);
    }
    
    dayElement.appendChild(dayEvents);
    
    // Click handler
    dayElement.addEventListener('click', () => {
        document.getElementById('eventDate').value = dayString;
        showTab('calendar');
        
        // Set default time if not already set
        if (!document.getElementById('eventHour').value) {
            const now = new Date();
            const currentHour24 = now.getHours();
            const currentMinute = now.getMinutes() >= 30 ? '30' : '00';
            
            // Convert to 12-hour format
            const time12 = convertTo12Hour(`${currentHour24.toString().padStart(2, '0')}:${currentMinute}`);
            
            document.getElementById('eventHour').value = time12.hour;
            document.getElementById('eventMinute').value = time12.minute;
            document.getElementById('eventAmPm').value = time12.ampm;
        }
        
        document.getElementById('eventTitle').focus();
    });
    
    return dayElement;
}

function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateCurrentMonthDisplay();
    renderCalendar();
}

function updateCurrentMonthDisplay() {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    document.getElementById('currentMonth').textContent = `${months[currentMonth]} ${currentYear}`;
}

// Events list rendering
function renderEvents() {
    const eventsList = document.getElementById('eventsList');
    if (!eventsList) return;
    
    eventsList.innerHTML = '';
    
    // Get upcoming events (next 30 days)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    const upcomingEvents = events
        .filter(event => {
            // Fix date parsing to avoid timezone issues
            const [year, month, day] = event.date.split('-');
            const eventDate = new Date(year, month - 1, day);
            return eventDate >= today && eventDate <= thirtyDaysFromNow;
        })
        .sort((a, b) => {
            // Fix date parsing for sorting
            const [yearA, monthA, dayA] = a.date.split('-');
            const [yearB, monthB, dayB] = b.date.split('-');
            const dateA = new Date(yearA, monthA - 1, dayA, ...a.time.split(':'));
            const dateB = new Date(yearB, monthB - 1, dayB, ...b.time.split(':'));
            return dateA - dateB;
        });
    
    console.log('Total events:', events.length);
    console.log('Upcoming events:', upcomingEvents.length);
    
    if (upcomingEvents.length === 0) {
        eventsList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No hay eventos</p>';
        return;
    }
    
    upcomingEvents.forEach(event => {
        const eventElement = createEventElement(event);
        eventsList.appendChild(eventElement);
    });
}

function createEventElement(event) {
    const eventDiv = document.createElement('div');
    eventDiv.className = `event-item member-${event.member.toLowerCase()} fade-in`;
    
    // Fix date parsing to avoid timezone issues
    const [year, month, day] = event.date.split('-');
    const eventDate = new Date(year, month - 1, day);
    const formattedDate = eventDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });
    
    // Convert time to 12-hour format for display
    const time12 = convertTo12Hour(event.time);
    const displayTime = `${time12.hour}:${time12.minute} ${time12.ampm}`;
    
    eventDiv.innerHTML = `
        <div class="event-header">
            <div class="event-title">${event.title}</div>
            <div class="event-time">${displayTime}</div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="color: #666; font-size: 14px;">${formattedDate}</div>
            <span class="event-member ${event.member.toLowerCase()}">${event.member}</span>
        </div>
        ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
        <div class="event-actions">
            <button class="btn-small btn-edit" onclick="event.stopPropagation(); editEvent(${event.id})">✏️ Editar</button>
            <button class="btn-small btn-delete" onclick="event.stopPropagation(); deleteEvent(${event.id})">🗑️ Eliminar</button>
        </div>
    `;
    
    return eventDiv;
}

// Plans management
function handlePlanSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const editingId = submitButton.getAttribute('data-editing');
    
    const title = document.getElementById('planTitle').value;
    const description = document.getElementById('planDescription').value;
    const priority = document.getElementById('planPriority').value;
    
    if (editingId) {
        // Updating existing plan
        const planIndex = plans.findIndex(p => p.id == editingId);
        if (planIndex !== -1) {
            plans[planIndex] = {
                ...plans[planIndex], // Keep original id and created date
                title: title,
                description: description,
                priority: priority,
                updated: new Date().toISOString()
            };
            
            // Reset form to normal mode
            submitButton.textContent = 'Agregar';
            submitButton.removeAttribute('data-editing');
            
            // Hide cancel button
            const cancelButton = form.querySelector('.btn-cancel-edit-plan');
            if (cancelButton) {
                cancelButton.style.display = 'none';
            }
            
            showNotification(`Idea "${title}" actualizada exitosamente`, 'success');
        }
    } else {
        // Creating new plan
        const planData = {
            id: Date.now(),
            title: title,
            description: description,
            priority: priority,
            created: new Date().toISOString(),
            completed: false
        };
        
        plans.push(planData);
        showNotification(`Idea "${title}" agregada`, 'success');
    }
    
    savePlans();
    renderPlans();
    
    // Clear form
    document.getElementById('planForm').reset();
}

function renderPlans() {
    const plansList = document.getElementById('plansList');
    if (!plansList) return; // Exit if not on ideas page
    
    plansList.innerHTML = '';
    
    if (plans.length === 0) {
        plansList.innerHTML = '<p style="text-align: center; color: #666;">No hay ideas</p>';
        return;
    }
    
    // Sort by priority and creation date
    const sortedPlans = plans.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return new Date(b.created) - new Date(a.created);
    });
    
    sortedPlans.forEach(plan => {
        const planElement = createPlanElement(plan);
        plansList.appendChild(planElement);
    });
}

function createPlanElement(plan) {
    const planDiv = document.createElement('div');
    planDiv.className = `plan-item slide-in`;
    
    const priorityLabels = {
        high: '❤️ Alta prioridad',
        medium: '💛 Media prioridad',
        low: '💙 Baja prioridad'
    };
    
    planDiv.innerHTML = `
        <div class="plan-header">
            <div class="plan-title">${plan.title}</div>
            <span class="plan-priority priority-${plan.priority}">${priorityLabels[plan.priority]}</span>
        </div>
        <div class="plan-description">${plan.description}</div>
        <div class="event-actions">
            <button class="btn-small btn-edit" onclick="event.stopPropagation(); editPlan(${plan.id})">✏️ Editar</button>
            <button class="btn-small btn-delete" onclick="deletePlan(${plan.id})">🗑️ Eliminar</button>
        </div>
    `;
    
    return planDiv;
}

function deletePlan(planId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta idea?')) {
        plans = plans.filter(plan => plan.id !== planId);
        savePlans();
        renderPlans();
        showNotification('Idea eliminada', 'info');
    }
}

function editPlan(planId) {
    console.log('editPlan llamada con ID:', planId);
    const plan = plans.find(p => p.id === planId);
    if (plan) {
        console.log('Plan encontrado:', plan);
        // Pre-fill form with plan data
        document.getElementById('planTitle').value = plan.title;
        document.getElementById('planDescription').value = plan.description;
        document.getElementById('planPriority').value = plan.priority;
        
        // Change submit button to update mode
        const form = document.getElementById('planForm');
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.textContent = '✏️ Actualizar';
        submitButton.setAttribute('data-editing', planId);
        
        // Add cancel button
        let cancelButton = form.querySelector('.btn-cancel-edit-plan');
        if (!cancelButton) {
            cancelButton = document.createElement('button');
            cancelButton.type = 'button';
            cancelButton.className = 'btn-cancel-edit-plan btn-secondary';
            cancelButton.textContent = '❌ Cancelar';
            cancelButton.style.marginLeft = '10px';
            cancelButton.onclick = cancelEditPlan;
            submitButton.parentNode.appendChild(cancelButton);
        }
        cancelButton.style.display = 'inline-block';
        
        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('planTitle').focus();
        
        showNotification(`Editando idea: ${plan.title}`, 'info');
        console.log('Modo de edición activado para idea:', plan.title);
    } else {
        console.error('Plan no encontrado con ID:', planId);
    }
}

function cancelEditPlan() {
    const form = document.getElementById('planForm');
    const submitButton = form.querySelector('button[type="submit"]');
    const cancelButton = form.querySelector('.btn-cancel-edit-plan');
    
    // Reset form
    form.reset();
    
    // Reset button
    submitButton.textContent = 'Agregar';
    submitButton.removeAttribute('data-editing');
    
    // Hide cancel button
    if (cancelButton) {
        cancelButton.style.display = 'none';
    }
    
    showNotification('Edición cancelada', 'info');
}

function convertPlanToEvent(planId) {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
        // Switch to calendar tab and pre-fill form
        showTab('calendar');
        document.getElementById('eventTitle').value = plan.title;
        document.getElementById('eventDescription').value = plan.description;
        document.getElementById('eventMember').value = 'Familia';
        document.getElementById('eventDate').focus();
        
        showNotification('Completa los detalles para programar el evento', 'info');
    }
}

// Simple notification system
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function checkUpcomingEvents() {
    const now = new Date();
    const reminderMinutes = 30; // Default 30 minutes reminder
    
    events.forEach(event => {
        const eventDateTime = new Date(event.date + 'T' + event.time);
        const reminderTime = new Date(eventDateTime.getTime() - (reminderMinutes * 60000));
        
        if (now >= reminderTime && now < eventDateTime) {
            // Check if we already sent this notification
            const notificationKey = `${event.id}-${reminderMinutes}`;
            if (!localStorage.getItem(notificationKey)) {
                sendEventNotification(event, reminderMinutes);
                localStorage.setItem(notificationKey, 'sent');
            }
        }
    });
}

function sendEventNotification(event, minutesBefore) {
    const title = `Recordatorio: ${event.title}`;
    const body = `${event.member} - En ${minutesBefore} minutos`;
    
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><text y="32" font-size="32">📅</text></svg>'
        });
    }
}

// Weekly Menu Functions
function generateMenuSuggestions() {
    try {
        const cookingTime = document.getElementById('cookingTime').value;
        const mealType = document.getElementById('mealType').value;
        const availableIngredients = document.getElementById('availableIngredients').value.toLowerCase().split(',').map(i => i.trim());
        const babyMode = document.getElementById('babyMode').checked;
        
        console.log('Ingredientes disponibles:', availableIngredients);
        
        const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        const mealTypes = mealType === 'any' ? ['breakfast', 'lunch', 'dinner'] : [mealType];
        
        weeklyMenu = [];
        
        days.forEach(day => {
            mealTypes.forEach(type => {
                let recipes = recipeDatabase[type] || [];
                console.log(`Recetas iniciales para ${type}:`, recipes.length);
                
                // Filter by cooking time
                if (cookingTime !== 'any') {
                    recipes = recipes.filter(recipe => recipe.time <= parseInt(cookingTime));
                    console.log(`Después de filtrar por tiempo (${cookingTime} min):`, recipes.length);
                }
                
                // Filter by baby mode
                if (babyMode) {
                    recipes = recipes.filter(recipe => recipe.babySafe);
                    console.log('Después de filtrar por modo bebé:', recipes.length);
                }
                
                // Filter by available ingredients
                if (availableIngredients.length > 0 && availableIngredients[0] !== '') {
                    console.log('Filtrando por ingredientes disponibles...');
                    recipes = recipes.filter(recipe => {
                        // Check if ALL recipe ingredients are available in user's list
                        const canMake = recipe.ingredients.every(ingredient => 
                            availableIngredients.some(available => 
                                ingredient.toLowerCase().includes(available.toLowerCase()) ||
                                available.toLowerCase().includes(ingredient.toLowerCase())
                            )
                        );
                        if (canMake) {
                            console.log(`✅ Puede hacer: ${recipe.name} con ingredientes:`, recipe.ingredients);
                        }
                        return canMake;
                    });
                    console.log('Recetas que se pueden hacer con ingredientes disponibles:', recipes.length);
                }
                
                // Select random recipe
                if (recipes.length > 0) {
                    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
                    weeklyMenu.push({
                        day: day,
                        mealType: type,
                        recipe: randomRecipe,
                        id: Date.now() + Math.random()
                    });
                }
            });
        });
        
        saveWeeklyMenu();
        renderWeeklyMenu();
        
        if (weeklyMenu.length === 0) {
            showNotification('No se encontraron recetas con los filtros seleccionados. Intenta con menos filtros o ingredientes diferentes.', 'info');
        } else {
            showNotification(`¡Menú semanal generado con ${weeklyMenu.length} platos!`, 'success');
        }
    } catch (error) {
        console.error('Error generating menu suggestions:', error);
        showNotification('Error al generar sugerencias de menú. Por favor, intenta de nuevo.', 'error');
    }
}

function renderWeeklyMenu() {
    try {
        const menuGrid = document.getElementById('menuGrid');
        if (!menuGrid) {
            console.error('Element menuGrid not found');
            return;
        }
        
        menuGrid.innerHTML = '';
        
        if (weeklyMenu.length === 0) {
            menuGrid.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No hay menú generado.</p>';
            return;
        }
        
        weeklyMenu.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = `menu-item ${item.recipe.babySafe ? 'baby-safe' : ''}`;
            
            const mealTypeNames = {
                breakfast: 'Desayuno',
                lunch: 'Almuerzo', 
                dinner: 'Cena',
                snack: 'Merienda'
            };
            
            menuItem.innerHTML = `
                <h6>${item.day} - ${mealTypeNames[item.mealType]}</h6>
                <div class="meal-info">
                    <span>⏰ ${item.recipe.time} min</span>
                    ${item.recipe.babySafe ? '<span>👶 Seguro para bebés</span>' : ''}
                </div>
                <div class="meal-description">${item.recipe.name}</div>
                <p style="font-size: 12px; color: #666; margin-bottom: 10px;">${item.recipe.description}</p>
                <div class="meal-tags">
                    ${item.recipe.ingredients.map(ing => `<span class="meal-tag">${ing}</span>`).join('')}
                </div>
                <div style="margin-top: 10px;">
                    <button onclick="removeFromMenu(${item.id})" class="btn-small btn-delete">🗑️ Quitar</button>
                </div>
            `;
            
            menuGrid.appendChild(menuItem);
        });
    } catch (error) {
        console.error('Error rendering weekly menu:', error);
        showNotification('Error al mostrar el menú semanal', 'error');
    }
}

function removeFromMenu(itemId) {
    weeklyMenu = weeklyMenu.filter(item => item.id !== itemId);
    saveWeeklyMenu();
    renderWeeklyMenu();
    showNotification('Plato eliminado del menú', 'info');
}

function generateShoppingList() {
    const allIngredients = [];
    
    weeklyMenu.forEach(item => {
        allIngredients.push(...item.recipe.ingredients);
    });
    
    // Count occurrences and remove duplicates
    const ingredientCount = {};
    allIngredients.forEach(ingredient => {
        ingredientCount[ingredient] = (ingredientCount[ingredient] || 0) + 1;
    });
    
    shoppingList = Object.keys(ingredientCount).map(ingredient => ({
        id: Date.now() + Math.random(),
        name: ingredient,
        quantity: ingredientCount[ingredient],
        completed: false
    }));
    
    saveShoppingList();
    renderShoppingList();
    showNotification('Lista de compras generada', 'success');
}

function renderShoppingList() {
    const shoppingListDiv = document.getElementById('shoppingList');
    if (!shoppingListDiv) return; // Exit if not on menu page
    
    shoppingListDiv.innerHTML = '';
    
    if (shoppingList.length === 0) {
        shoppingListDiv.innerHTML = '<p style="text-align: center; color: #666;">Genera un menú primero para crear la lista de compras</p>';
        return;
    }
    
    shoppingList.forEach(item => {
        const shoppingItem = document.createElement('div');
        shoppingItem.className = `shopping-item ${item.completed ? 'completed' : ''}`;
        
        shoppingItem.innerHTML = `
            <input type="checkbox" ${item.completed ? 'checked' : ''} onchange="toggleShoppingItem(${item.id})">
            <span>${item.name} ${item.quantity > 1 ? `(${item.quantity})` : ''}</span>
        `;
        
        shoppingListDiv.appendChild(shoppingItem);
    });
    
    // Add save to favorites button
    if (shoppingList.length > 0) {
        const saveBtn = document.createElement('button');
        saveBtn.textContent = '⭐ Guardar como Favorita';
        saveBtn.className = 'btn-secondary';
        saveBtn.style.marginTop = '10px';
        saveBtn.onclick = saveListAsFavorite;
        shoppingListDiv.appendChild(saveBtn);
    }
}

function toggleShoppingItem(itemId) {
    const item = shoppingList.find(item => item.id === itemId);
    if (item) {
        item.completed = !item.completed;
        saveShoppingList();
        renderShoppingList();
    }
}

function saveListAsFavorite() {
    const listName = prompt('Nombre para la lista favorita:');
    if (listName) {
        favoriteLists.push({
            id: Date.now(),
            name: listName,
            items: [...shoppingList]
        });
        saveFavoriteLists();
        renderFavoriteLists();
        showNotification(`Lista "${listName}" guardada en favoritas`, 'success');
    }
}

function renderFavoriteLists() {
    const container = document.getElementById('favoriteLists');
    if (!container) return; // Exit if not on menu page
    
    container.innerHTML = '';
    
    if (favoriteLists.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 10px;">No hay favoritos</p>';
        return;
    }
    
    favoriteLists.forEach(list => {
        const listContainer = document.createElement('div');
        listContainer.className = 'favorite-list-item';
        
        const loadBtn = document.createElement('button');
        loadBtn.className = 'favorite-list-btn';
        loadBtn.textContent = `📋 ${list.name}`;
        loadBtn.onclick = () => loadFavoriteList(list.id);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete-favorite';
        deleteBtn.textContent = '🗑️';
        deleteBtn.title = 'Eliminar lista favorita';
        deleteBtn.onclick = () => deleteFavoriteList(list.id);
        
        listContainer.appendChild(loadBtn);
        listContainer.appendChild(deleteBtn);
        container.appendChild(listContainer);
    });
}

function loadFavoriteList(listId) {
    const favoriteList = favoriteLists.find(list => list.id === listId);
    if (favoriteList) {
        shoppingList = favoriteList.items.map(item => ({...item, completed: false}));
        saveShoppingList();
        renderShoppingList();
        showNotification(`Lista "${favoriteList.name}" cargada`, 'success');
    }
}

function deleteFavoriteList(listId) {
    const list = favoriteLists.find(l => l.id === listId);
    if (list && confirm(`¿Estás seguro de que quieres eliminar la lista favorita "${list.name}"?`)) {
        favoriteLists = favoriteLists.filter(l => l.id !== listId);
        saveFavoriteLists();
        renderFavoriteLists();
        showNotification(`Lista "${list.name}" eliminada de favoritas`, 'info');
    }
}

function toggleBabyMode() {
    const babyMode = document.getElementById('babyMode').checked;
    showNotification(babyMode ? 'Modo bebés activado 👶' : 'Modo bebés desactivado', 'info');
}

// Mini Challenges Functions
async function handleCustomChallengeSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const editingId = submitButton.getAttribute('data-editing');
    const isEditingCustom = submitButton.getAttribute('data-editing-custom') === 'true';
    
    const title = form.customTitle.value.trim();
    const category = form.customCategory.value;
    const description = form.customDescription.value.trim();
    const duration = form.customDuration.value.trim();
    const difficulty = form.customDifficulty.value;
    const points = parseInt(form.customPoints.value);
    
    if (!title || !category || !description || !duration || !difficulty || !points) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }
    
    if (editingId) {
        // Editing existing challenge
        const updatedChallenge = {
            id: parseInt(editingId),
            category: category,
            title: title,
            description: description,
            points: points,
            duration: duration,
            difficulty: difficulty,
            isCustom: isEditingCustom
        };
        
        if (isEditingCustom) {
            // Editing custom challenge
            const challengeIndex = customChallenges.findIndex(c => c.id == editingId);
            if (challengeIndex !== -1) {
                customChallenges[challengeIndex] = updatedChallenge;
                await JSONBinAPI.saveAllData();
            }
        } else {
            // Editing default challenge - save to modified challenges
            const modifiedIndex = modifiedChallenges.findIndex(c => c.id == editingId);
            if (modifiedIndex !== -1) {
                modifiedChallenges[modifiedIndex] = updatedChallenge;
            } else {
                modifiedChallenges.push(updatedChallenge);
            }
            await JSONBinAPI.saveAllData();
        }
        
        // Update current challenge if it's the one being edited
        if (currentChallenge && currentChallenge.id == editingId) {
            currentChallenge = updatedChallenge;
            saveCurrentChallenge();
            renderCurrentChallenge();
        }
        
        // Reset form
        form.reset();
        submitButton.textContent = '➕ Crear Reto';
        submitButton.removeAttribute('data-editing');
        submitButton.removeAttribute('data-editing-custom');
        
        const cancelButton = form.querySelector('.btn-cancel');
        if (cancelButton) {
            cancelButton.style.display = 'none';
        }
        
        const challengeType = isEditingCustom ? 'personalizado' : 'predefinido';
        showNotification(`¡Reto ${challengeType} "${title}" actualizado exitosamente! ✏️`, 'success');
    } else {
        // Creating new challenge
        const newChallenge = {
            id: Date.now(), // Use timestamp as unique ID
            category: category,
            title: title,
            description: description,
            points: points,
            duration: duration,
            difficulty: difficulty,
            isCustom: true
        };
        
        // Add to custom challenges array
        customChallenges.push(newChallenge);
        await JSONBinAPI.saveAllData();
        
        // Reset form
        form.reset();
        
        showNotification(`¡Reto personalizado "${title}" creado exitosamente! 🎯`, 'success');
    }
    
    // Refresh challenges list
    renderChallengesList();
}

function getAllChallenges() {
    console.log('📋 GET ALL CHALLENGES - START');
    console.log('  - challengeDatabase.length:', challengeDatabase.length);
    console.log('  - customChallenges.length:', customChallenges.length);
    console.log('  - modifiedChallenges.length:', modifiedChallenges.length);
    console.log('  - deletedChallenges.length:', deletedChallenges.length);
    
    // Start with default challenges
    let allChallenges = [...challengeDatabase];
    console.log('  - After adding default challenges:', allChallenges.length);
    
    // Remove deleted challenges
    if (deletedChallenges && deletedChallenges.length > 0) {
        allChallenges = allChallenges.filter(challenge => !deletedChallenges.includes(challenge.id));
        console.log('  - After removing deleted challenges:', allChallenges.length);
    }
    
    // Apply modifications to default challenges
    if (modifiedChallenges && modifiedChallenges.length > 0) {
        allChallenges = allChallenges.map(challenge => {
            const modified = modifiedChallenges.find(mod => mod.id === challenge.id);
            return modified ? modified : challenge;
        });
        console.log('  - After applying modifications:', allChallenges.length);
    }
    
    // Add custom challenges
    if (customChallenges && customChallenges.length > 0) {
        allChallenges = [...allChallenges, ...customChallenges];
        console.log('  - After adding custom challenges:', allChallenges.length);
    }
    
    console.log('📋 Final challenge count:', allChallenges.length);
    console.log('📋 GET ALL CHALLENGES - END');
    return allChallenges;
}

function generateNewChallenge() {
    console.log('🎲 GENERATING NEW CHALLENGE - START');
    const allChallenges = getAllChallenges();
    console.log('  - All challenges available:', allChallenges.length);
    
    const availableChallenges = allChallenges.filter(challenge => 
        !completedChallenges.includes(challenge.id) && 
        (!currentChallenge || currentChallenge.id !== challenge.id)
    );
    
    console.log('  - Available challenges:', availableChallenges.length);
    console.log('  - Completed challenges:', completedChallenges.length);
    console.log('  - Current challenge ID:', currentChallenge ? currentChallenge.id : 'none');
    
    if (availableChallenges.length === 0) {
        console.log('⚠️ No available challenges, showing completion message');
        showNotification('¡Felicitaciones! Han completado todos los retos disponibles 🎉', 'success');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableChallenges.length);
    const selectedChallenge = availableChallenges[randomIndex];
    
    // Ensure the challenge has all required properties
    currentChallenge = {
        id: selectedChallenge.id,
        category: selectedChallenge.category || 'general',
        title: selectedChallenge.title || 'Reto Sin Título',
        description: selectedChallenge.description || 'Sin descripción',
        points: selectedChallenge.points || 10,
        duration: selectedChallenge.duration || '30 min',
        difficulty: selectedChallenge.difficulty || 'Fácil',
        isCustom: selectedChallenge.isCustom || false,
        startDate: new Date().toISOString()
    };
    
    console.log('✅ New challenge selected:', currentChallenge);
    
    saveCurrentChallenge();
    console.log('💾 Current challenge saved to localStorage');
    
    renderCurrentChallenge();
    console.log('🎨 Current challenge rendered');
    
    console.log('🎲 GENERATING NEW CHALLENGE - END');
}

function renderCurrentChallenge() {
    console.log('🎯 RENDER CURRENT CHALLENGE - START');
    const container = document.getElementById('currentChallenge');
    
    if (!container) {
        console.error('❌ Container currentChallenge not found!');
        return;
    }
    console.log('✅ Container found:', container);
    
    console.log('📊 Current challenge:', currentChallenge);
    console.log('📊 currentChallenge type:', typeof currentChallenge);
    
    if (!currentChallenge) {
        console.log('⚠️ No hay reto activo, mostrando mensaje de generar');
        container.innerHTML = `
            <div class="no-challenge-message">
                <p style="text-align: center; color: #666; padding: 20px; margin-bottom: 15px;">
                    No hay reto activo. ¡Genera uno nuevo! 🎯
                </p>
            </div>
        `;
        return;
    }
    
    // Ensure we have all required fields
    const title = currentChallenge.title || 'Reto Sin Título';
    const description = currentChallenge.description || 'Sin descripción';
    const points = currentChallenge.points || 10;
    const category = currentChallenge.category || 'general';
    const duration = currentChallenge.duration || '30 min';
    const difficulty = currentChallenge.difficulty || 'Fácil';
    
    console.log('📝 Challenge data:', { title, description, points, category, duration, difficulty });
    
    const categoryEmoji = {
        'no-screen': '📵',
        'creative': '🎨', 
        'active': '🏃',
        'cooking': '👨‍🍳'
    };
    
    const challengeHTML = `
        <div class="challenge-details">
            <div class="challenge-header">
                <span class="challenge-category">${categoryEmoji[category] || '🎯'} ${category}</span>
                <span class="challenge-points">+${points} pts</span>
            </div>
            <h3>${title}</h3>
            <p class="challenge-description">${description}</p>
            <div class="challenge-meta">
                <span class="duration">⏱️ ${duration}</span>
                <span class="difficulty">${difficulty}</span>
                ${currentChallenge.isCustom ? '<span class="custom-badge">✨ Personalizado</span>' : '<span class="default-badge">🏠 Predefinido</span>'}
            </div>
            
            <div class="challenge-action-buttons" style="margin-top: 20px; text-align: center; display: block !important; visibility: visible !important; opacity: 1 !important;">
                <button onclick="completeChallenge()" 
                        class="btn-primary btn-complete" 
                        style="background: #27ae60 !important; color: white !important; border: none !important; padding: 12px 25px !important; font-size: 16px !important; margin: 8px !important; border-radius: 25px !important; cursor: pointer !important; display: inline-block !important; visibility: visible !important; opacity: 1 !important;">
                    ✅ Completado
                </button>
                <button onclick="skipChallenge()" 
                        class="btn-secondary btn-skip" 
                        style="background: #e74c3c !important; color: white !important; border: none !important; padding: 12px 25px !important; font-size: 16px !important; margin: 8px !important; border-radius: 25px !important; cursor: pointer !important; display: inline-block !important; visibility: visible !important; opacity: 1 !important;">
                    ⏭️ Omitir
                </button>
            </div>
        </div>
    `;
    
    console.log('🔧 Setting container innerHTML...');
    container.innerHTML = challengeHTML;
    console.log('✅ Container innerHTML set successfully');
    
    // Force visibility check
    setTimeout(() => {
        const buttons = container.querySelectorAll('button');
        console.log('🔍 Buttons found after render:', buttons.length);
        buttons.forEach((btn, index) => {
            console.log(`Button ${index}:`, {
                text: btn.textContent,
                display: getComputedStyle(btn).display,
                visibility: getComputedStyle(btn).visibility,
                opacity: getComputedStyle(btn).opacity
            });
        });
    }, 100);
}

function renderFamilyScore() {
    const familyScoreElement = document.getElementById('familyScore');
    if (familyScoreElement) {
        familyScoreElement.textContent = `🏆 Puntuación Familiar: ${familyScore}`;
    }
}

function resetFamilyScore() {
    if (confirm('¿Estás seguro de que quieres reiniciar la puntuación familiar? Esta acción no se puede deshacer.')) {
        familyScore = 0;
        completedChallenges = [];
        
        // Clear achievements
        achievements = [];
        
        // Save reset data
        saveCompletedChallenges();
        
        // Update UI
        renderFamilyScore();
        renderAchievements();
        renderChallengesList();
        
        showNotification('¡Puntuación familiar reiniciada! 🔄', 'success');
    }
}

function completeChallenge() {
    if (!currentChallenge) {
        showNotification('No hay reto activo para completar', 'error');
        return;
    }
    
    const challengeTitle = currentChallenge.title;
    const pointsEarned = currentChallenge.points;
    
    // Add to completed challenges
    completedChallenges.push(currentChallenge.id);
    
    // Add points to family score
    const oldScore = familyScore;
    familyScore += pointsEarned;
    
    console.log(`Completing challenge: ${challengeTitle}`);
    console.log(`Points earned: ${pointsEarned}`);
    console.log(`Old score: ${oldScore}, New score: ${familyScore}`);
    
    // Save data
    saveCompletedChallenges();
    
    // Add achievement
    addAchievement(currentChallenge);
    
    // Update UI elements that exist
    const familyScoreElement = document.getElementById('familyScore');
    if (familyScoreElement) {
        familyScoreElement.textContent = `🏆 Puntuación Familiar: ${familyScore}`;
        console.log('UI updated successfully');
    } else {
        console.error('familyScore element not found!');
    }
    
    showNotification(`¡Reto completado! +${pointsEarned} puntos 🎉\nTotal: ${familyScore} puntos`, 'success');
    
    // Clear current challenge
    currentChallenge = null;
    saveCurrentChallenge();
    
    // Update other UI elements
    renderChallengesList();
    renderAchievements();
    
    // Automatically generate the next challenge
    generateNewChallenge();
    
    console.log(`Challenge "${challengeTitle}" completed successfully. Total score: ${familyScore}`);
}

function skipChallenge() {
    if (!currentChallenge) return;
    
    // Clear current challenge
    currentChallenge = null;
    saveCurrentChallenge();
    
    // Automatically generate the next challenge
    generateNewChallenge();
}

function filterChallenges(category) {
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderChallengesList(category);
}

function renderChallengesList(filterCategory = 'all') {
    const container = document.getElementById('challengesList');
    if (!container) return;
    
    const allChallenges = getAllChallenges();
    
    let challengesToShow = allChallenges.filter(challenge => 
        !completedChallenges.includes(challenge.id) &&
        (!currentChallenge || currentChallenge.id !== challenge.id)
    );
    
    if (filterCategory !== 'all') {
        challengesToShow = challengesToShow.filter(challenge => challenge.category === filterCategory);
    }
    
    if (challengesToShow.length === 0) {
        container.innerHTML = `
            <p style="text-align: center; color: #666; padding: 20px;">
                No hay retos disponibles en esta categoría.
            </p>
        `;
        return;
    }
    
    const categoryEmoji = {
        'no-screen': '📵',
        'creative': '🎨',
        'active': '🏃',
        'cooking': '👨‍🍳'
    };
    
    container.innerHTML = challengesToShow.map(challenge => `
        <div class="challenge-item" onclick="setCurrentChallenge(${challenge.id})">
            <div class="challenge-preview">
                <span class="category-icon">${categoryEmoji[challenge.category]}</span>
                <div class="challenge-info">
                    <h4>${challenge.title} ${challenge.isCustom ? '✨' : '🏠'}</h4>
                    <p>${challenge.description}</p>
                    <div class="challenge-meta">
                        <span>⏱️ ${challenge.duration}</span>
                        <span>${challenge.difficulty}</span>
                        <span>🏆 ${challenge.points} pts</span>
                    </div>
                </div>
            </div>
            <div class="challenge-actions">
                <button onclick="event.stopPropagation(); editChallenge(${challenge.id}, ${challenge.isCustom || false})" class="btn-edit" title="Editar reto">✏️</button>
                <button onclick="event.stopPropagation(); deleteChallenge(${challenge.id}, ${challenge.isCustom || false})" class="btn-delete" title="Eliminar reto">🗑️</button>
            </div>
        </div>
    `).join('');
}

function setCurrentChallenge(challengeId) {
    const allChallenges = getAllChallenges();
    currentChallenge = allChallenges.find(c => c.id === challengeId);
    
    if (currentChallenge) {
        currentChallenge.startDate = new Date().toISOString();
        saveCurrentChallenge();
        renderCurrentChallenge();
        renderChallengesList();
        showNotification(`Reto "${currentChallenge.title}" seleccionado!`, 'success');
    }
}

function addAchievement(challenge) {
    const achievement = {
        id: Date.now(),
        challengeTitle: challenge.title,
        challengeCategory: challenge.category,
        points: challenge.points,
        completedDate: new Date().toISOString(),
        isCustom: challenge.isCustom || false
    };
    
    let achievements = JSON.parse(localStorage.getItem('familyAchievements') || '[]');
    achievements.push(achievement);
    // TODO: Add achievements to JSONBin structure
    localStorage.setItem('familyAchievements', JSON.stringify(achievements));
    
    renderAchievements();
}

function renderAchievements() {
    const container = document.getElementById('achievements');
    if (!container) return; // Exit if not on challenges page
    
    const achievements = JSON.parse(localStorage.getItem('familyAchievements') || '[]');
    
    if (achievements.length === 0) {
        container.innerHTML = `
            <p style="text-align: center; color: #666; padding: 20px;">
                ¡Completen retos para ganar premios! 🏆
            </p>
        `;
        return;
    }
    
    const categoryEmoji = {
        'no-screen': '📵',
        'creative': '🎨',
        'active': '🏃',
        'cooking': '👨‍🍳'
    };
    
    // Show latest 6 achievements
    const recentAchievements = achievements.slice(-6).reverse();
    
    container.innerHTML = recentAchievements.map(achievement => `
        <div class="achievement-item">
            <div class="achievement-icon">${categoryEmoji[achievement.challengeCategory]}</div>
            <div class="achievement-info">
                <h5>${achievement.challengeTitle} ${achievement.isCustom ? '✨' : ''}</h5>
                <span class="achievement-points">+${achievement.points} pts</span>
                <span class="achievement-date">${formatDate(new Date(achievement.completedDate))}</span>
            </div>
        </div>
    `).join('');
}

// Debug function to check current state
function debugChallenges() {
    console.log('=== DEBUG CHALLENGES ===');
    console.log('Family Score:', familyScore);
    console.log('Current Challenge:', currentChallenge);
    console.log('Completed Challenges:', completedChallenges);
    console.log('Family Score Element exists:', !!document.getElementById('familyScore'));
    console.log('========================');
}

// Debugging function for inventory
function debugInventory() {
    console.log('🔍 DEBUG - Estado del inventario:');
    console.log('📋 Longitud:', inventory.length);
    console.log('📋 Contenido completo:', inventory);
    
    inventory.forEach((item, index) => {
        console.log(`📋 Índice ${index}: ${item.name} - Cantidad: ${item.qty} - Fecha: ${item.dateAdded}`);
    });
    
    // También verificar localStorage para comparar
    const localInventory = JSON.parse(localStorage.getItem('homeInventory') || '[]');
    console.log('💾 Inventario en localStorage:', localInventory);
    
    return {
        memoryInventory: inventory,
        localInventory: localInventory,
        match: JSON.stringify(inventory) === JSON.stringify(localInventory)
    };
}

// Función para llamar desde la consola del navegador
window.debugInventory = debugInventory;

// Storage functions - Now using JSONBin
async function saveCurrentChallenge() {
    await JSONBinAPI.saveAllData();
}

async function saveCompletedChallenges() {
    await JSONBinAPI.saveAllData();
}

// Storage functions for menu functionality
async function saveWeeklyMenu() {
    await JSONBinAPI.saveAllData();
}

async function saveShoppingList() {
    await JSONBinAPI.saveAllData();
}

async function saveFavoriteLists() {
    await JSONBinAPI.saveAllData();
}

// Storage functions for events and plans
async function saveEvents() {
    await JSONBinAPI.saveAllData();
}

async function savePlans() {
    await JSONBinAPI.saveAllData();
}

function loadEvents() {
    events = JSON.parse(localStorage.getItem('familyEvents') || '[]');
}

function loadPlans() {
    plans = JSON.parse(localStorage.getItem('familyPlans') || '[]');
}

// Initialize challenges when app loads
function initializeChallenges() {
    console.log('🚀 INICIALIZANDO RETOS...');
    console.log('📊 Estado inicial:');
    console.log('  - currentChallenge:', currentChallenge);
    console.log('  - familyScore:', familyScore);
    console.log('  - customChallenges.length:', customChallenges.length);
    console.log('  - completedChallenges.length:', completedChallenges.length);
    
    // Update family score display
    renderFamilyScore();
    
    // Render current challenge and challenges list
    console.log('🎯 Renderizando reto actual...');
    renderCurrentChallenge();
    
    console.log('📝 Renderizando lista de retos...');
    renderChallengesList();
    
    console.log('🏆 Renderizando logros...');
    renderAchievements();
    
    // Auto-generate a challenge if none exists
    if (!currentChallenge) {
        console.log('⚠️ No hay reto activo, generando uno...');
        generateNewChallenge();
    } else {
        console.log('✅ Reto activo encontrado:', currentChallenge.title);
    }
    
    console.log('✅ Retos inicializados correctamente');
}

// Context for KovalBot
function getChallengesContext() {
    const allChallenges = getAllChallenges();
    return {
        totalChallenges: allChallenges.length,
        customChallenges: customChallenges.length,
        completedChallenges: completedChallenges.length,
        familyScore: familyScore,
        currentChallenge: currentChallenge,
        categories: ['no-screen', 'creative', 'active', 'cooking']
    };
}

// Utility function for date formatting
function formatDate(date) {
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };
    return date.toLocaleDateString('es-ES', options);
}

function editChallenge(challengeId, isCustom = false) {
    let challenge;
    
    if (isCustom) {
        challenge = customChallenges.find(c => c.id === challengeId);
    } else {
        // Check if it's a modified default challenge first
        challenge = modifiedChallenges.find(c => c.id === challengeId);
        if (!challenge) {
            // Get from original database
            challenge = challengeDatabase.find(c => c.id === challengeId);
        }
    }
    
    if (!challenge) {
        showNotification('Reto no encontrado', 'error');
        return;
    }
    
    // Fill the form with existing data
    document.getElementById('customTitle').value = challenge.title;
    document.getElementById('customCategory').value = challenge.category;
    document.getElementById('customDescription').value = challenge.description;
    document.getElementById('customDuration').value = challenge.duration;
    document.getElementById('customDifficulty').value = challenge.difficulty;
    document.getElementById('customPoints').value = challenge.points;
    
    // Change form button to "Update"
    const form = document.getElementById('customChallengeForm');
    const submitButton = form.querySelector('button[type="submit"]');
    const cancelButton = form.querySelector('.btn-cancel');
    
    submitButton.textContent = '✏️ Actualizar Reto';
    submitButton.setAttribute('data-editing', challengeId);
    submitButton.setAttribute('data-editing-custom', isCustom);
    
    if (cancelButton) {
        cancelButton.style.display = 'inline-block';
    }
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth' });
    
    const challengeType = isCustom ? 'personalizado' : 'predefinido';
    showNotification(`Editando reto ${challengeType}: ${challenge.title}`, 'info');
}

async function deleteChallenge(challengeId, isCustom = false) {
    let challenge;
    
    if (isCustom) {
        challenge = customChallenges.find(c => c.id === challengeId);
    } else {
        // Check modified challenges first, then original database
        challenge = modifiedChallenges.find(c => c.id === challengeId) || 
                   challengeDatabase.find(c => c.id === challengeId);
    }
    
    if (!challenge) {
        showNotification('Reto no encontrado', 'error');
        return;
    }
    
    const challengeType = isCustom ? 'personalizado' : 'predefinido';
    const confirmMessage = isCustom ? 
        `¿Estás seguro de que quieres eliminar el reto personalizado "${challenge.title}"? Esta acción no se puede deshacer.` :
        `¿Estás seguro de que quieres eliminar el reto predefinido "${challenge.title}"? Podrás restaurarlo más tarde.`;
    
       
    if (confirm(confirmMessage)) {
        if (isCustom) {
            // Remove from custom challenges
            customChallenges = customChallenges.filter(c => c.id !== challengeId);
            await JSONBinAPI.saveAllData();
        } else {
            // Add to deleted challenges list (for default challenges)
            if (!deletedChallenges.includes(challengeId)) {
                deletedChallenges.push(challengeId);
            }
            
            // Remove from modified challenges if it was there
            modifiedChallenges = modifiedChallenges.filter(c => c.id !== challengeId);
            await JSONBinAPI.saveAllData();
        }
        
        // If this was the current challenge, clear it
        if (currentChallenge && currentChallenge.id === challengeId) {
            currentChallenge = null;
            saveCurrentChallenge();
            renderCurrentChallenge();
        }
        
        // Remove from completed challenges if it was there
        completedChallenges = completedChallenges.filter(id => id !== challengeId);
        saveCompletedChallenges();
        
        // Refresh the list
        renderChallengesList();
        
        const actionText = isCustom ? 'eliminado permanentemente' : 'ocultado';
        showNotification(`Reto "${challenge.title}" ${actionText}`, 'success');
    }
}

async function restoreDefaultChallenges() {
    if (deletedChallenges.length === 0) {
        showNotification('No hay retos predefinidos para restaurar', 'info');
        return;
    }
    
    const confirmMessage = `¿Restaurar ${deletedChallenges.length} reto(s) predefinido(s) eliminado(s)?`;
    
    if (confirm(confirmMessage)) {
        // Clear deleted challenges list to restore all
        const restoredCount = deletedChallenges.length;
        deletedChallenges = [];
        
        // Save changes
        await JSONBinAPI.saveAllData();
        
        // Refresh the UI
        renderChallengesList();
        
        showNotification(`✅ ${restoredCount} reto(s) predefinido(s) restaurado(s)`, 'success');
    }
}

// ===== INVENTORY FUNCTIONS =====

async function handleInventorySubmit(e) {
    e.preventDefault();
    
    const itemName = document.getElementById('itemName').value.trim();
    const itemQty = parseInt(document.getElementById('itemQty').value);
    
    if (!itemName || itemQty < 1) {
        showNotification('Por favor ingresa un nombre válido y cantidad', 'error');
        return;
    }
    
    // Check if item already exists
    const existingItemIndex = inventory.findIndex(item => 
        item.name.toLowerCase() === itemName.toLowerCase()
    );
    
    if (existingItemIndex !== -1) {
        // Update existing item
        inventory[existingItemIndex].qty += itemQty;
        inventory[existingItemIndex].dateAdded = new Date().toISOString();
        showNotification(`${itemName} actualizado (+${itemQty})`, 'success');
    } else {
        // Add new item
        const newItem = {
            id: Date.now(),
            name: itemName,
            qty: itemQty,
            dateAdded: new Date().toISOString()
        };
        inventory.push(newItem);
        showNotification(`${itemName} agregado al inventario`, 'success');
    }
    
    await saveInventory();
    renderInventory();
    
    // Reset form
    document.getElementById('inventoryForm').reset();
    document.getElementById('itemQty').value = 1;
}

async function saveInventory() {
    await JSONBinAPI.saveAllData();
}

function renderInventory() {
    const inventoryList = document.getElementById('inventoryList');
    if (!inventoryList) return;
    
    inventoryList.innerHTML = '';
    
    if (inventory.length === 0) {
        inventoryList.innerHTML = '<div style="color:#b76e79;text-align:center;padding:20px;">No hay artículos en el inventario</div>';
        return;
    }
    
    // Sort: First by quantity (0 quantity items go to bottom), then by name alphabetically
    const sortedInventory = inventory.map((item, originalIndex) => ({ ...item, originalIndex }))
                                   .sort((a, b) => {
                                       // If one item has 0 quantity and the other doesn't, put 0 quantity at bottom
                                       if (a.qty === 0 && b.qty > 0) return 1;
                                       if (a.qty > 0 && b.qty === 0) return -1;
                                       // If both have same quantity status, sort alphabetically by name
                                       return a.name.localeCompare(b.name);
                                   });
    
    sortedInventory.forEach((item, sortedIndex) => {
        const itemCard = createInventoryItemCard(item, item.originalIndex);
        inventoryList.appendChild(itemCard);
    });
}

function createInventoryItemCard(item, index) {
    const card = document.createElement('div');
    card.className = 'item-card';
    
    // Add gray effect class if quantity is 0
    if (item.qty === 0) {
        card.classList.add('item-card-empty');
    }
    
    // Format the date
    const date = new Date(item.dateAdded);
    const formattedDate = date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    });
    
    card.innerHTML = `
        <div class="item-title">${item.name}</div>
        <div class="item-meta">
            <div class="qty-controls">
                <button class="qty-btn" onclick="decrementItemQty(${index})" ${item.qty === 0 ? 'disabled' : ''}>-</button>
                <span class="qty-display">Cantidad: <b>${item.qty}</b></span>
                <button class="qty-btn" onclick="incrementItemQty(${index})">+</button>
            </div>
        </div>
        <div class="item-date">Actualizado: ${formattedDate}</div>
        <button class="remove-btn" onclick="removeInventoryItem(${index})">Eliminar</button>
    `;
    
    return card;
}

async function incrementItemQty(index) {
    if (index < 0 || index >= inventory.length) {
        console.error('❌ Índice fuera de rango:', index, 'Rango válido: 0 -', inventory.length - 1);
        showNotification('Error: Índice de artículo inválido', 'error');
        return;
    }
    
    if (!inventory[index]) {
        console.error('❌ Artículo no encontrado en índice:', index);
        showNotification('Error: Artículo no encontrado', 'error');
        return;
    }
    
    const itemName = inventory[index].name;
    inventory[index].qty += 1;
    inventory[index].dateAdded = new Date().toISOString();
    
    try {
        await saveInventory();
        renderInventory();
        showNotification(`${itemName} incrementado a ${inventory[index].qty}`, 'info');
    } catch (error) {
        console.error('❌ Error guardando inventario después del incremento:', error);
        showNotification('Error guardando cambios', 'error');
    }
}

async function decrementItemQty(index) {
    if (index < 0 || index >= inventory.length) {
        console.error('❌ Índice fuera de rango:', index, 'Rango válido: 0 -', inventory.length - 1);
        showNotification('Error: Índice de artículo inválido', 'error');
        return;
    }
    
    if (!inventory[index]) {
        console.error('❌ Artículo no encontrado en índice:', index);
        showNotification('Error: Artículo no encontrado', 'error');
        return;
    }
    
    const itemName = inventory[index].name;
    const currentQty = inventory[index].qty;
    
    if (currentQty === 0) {
        showNotification(`${itemName} ya está agotado`, 'info');
        return;
    }
    
    inventory[index].qty -= 1;
    inventory[index].dateAdded = new Date().toISOString();
    
    try {
        await saveInventory();
        renderInventory();
        
        if (inventory[index].qty === 0) {
            showNotification(`${itemName} agotado`, 'warning');
        } else {
            showNotification(`${itemName} decrementado a ${inventory[index].qty}`, 'info');
        }
    } catch (error) {
        console.error('❌ Error guardando inventario después del decremento:', error);
        showNotification('Error guardando cambios', 'error');
    }
}

async function removeInventoryItem(index) {
    if (index < 0 || index >= inventory.length) {
        console.error('❌ Índice fuera de rango:', index, 'Rango válido: 0 -', inventory.length - 1);
        showNotification('Error: Índice de artículo inválido', 'error');
        return;
    }
    
    if (!inventory[index]) {
        console.error('❌ Artículo no encontrado en índice:', index);
        showNotification('Error: Artículo no encontrado', 'error');
        return;
    }
    
    const itemName = inventory[index].name;
    
    if (confirm(`¿Estás seguro de que quieres eliminar "${itemName}" del inventario?`)) {
        inventory.splice(index, 1);
        
        try {
            await saveInventory();
            renderInventory();
            showNotification(`${itemName} eliminado del inventario`, 'success');
        } catch (error) {
            console.error('❌ Error guardando inventario después de la eliminación:', error);
            showNotification('Error guardando cambios', 'error');
        }
    }
}

function handleInventorySearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const query = searchInput.value.toLowerCase().trim();
    
    if (query.length === 0) {
        searchResults.style.display = 'none';
        searchResults.innerHTML = '';
        return;
    }
    
    const filteredItems = inventory.filter(item => 
        item.name.toLowerCase().includes(query)
    );
    
    if (filteredItems.length === 0) {
        searchResults.style.display = 'none';
        return;
    }
    
    searchResults.innerHTML = '';
    filteredItems.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
            <strong>${item.name}</strong> - Cantidad: ${item.qty}
            ${item.qty === 0 ? '<span style="color: #e74c3c;"> (Agotado)</span>' : ''}
        `;
        resultItem.onclick = () => {
            searchInput.value = '';
            searchResults.style.display = 'none';
            // Scroll to the item in the list
            const itemCards = document.querySelectorAll('.item-card');
            itemCards.forEach(card => {
                if (card.querySelector('.item-title').textContent === item.name) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    card.style.background = '#fff3cd';
                    setTimeout(() => {
                        card.style.background = '';
                    }, 2000);
                }
            });
        };
        searchResults.appendChild(resultItem);
    });
    
    searchResults.style.display = 'block';
}

// Hide search results when clicking outside
document.addEventListener('click', function(e) {
    const searchContainer = document.querySelector('.search-container');
    const searchResults = document.getElementById('searchResults');
    
    if (searchContainer && searchResults && !searchContainer.contains(e.target)) {
        searchResults.style.display = 'none';
    }
});

// Backup and Restore Functions for Data Safety
// Auto-backup every day (silent emergency backup only)
function createAutoBackup() {
    const lastBackup = localStorage.getItem('lastAutoBackup');
    const today = new Date().toDateString();
    
    if (lastBackup !== today) {
        // Create backup in localStorage as emergency fallback
        const emergencyBackup = {
            familyEvents: events,
            familyPlans: plans,
            weeklyMenu: weeklyMenu,
            shoppingList: shoppingList,
            favoriteLists: favoriteLists,
            homeInventory: inventory,
            familyChallenges: challenges,
            currentChallenge: currentChallenge,
            completedChallenges: completedChallenges,
            familyScore: familyScore,
            customChallenges: customChallenges,
            modifiedChallenges: modifiedChallenges,
            deletedChallenges: deletedChallenges,
            backupDate: new Date().toISOString()
        };
        
        localStorage.setItem('emergencyBackup', JSON.stringify(emergencyBackup));
        localStorage.setItem('lastAutoBackup', today);
        
        console.log('📦 Silent auto-backup created');
    }
}

// Initialize silent auto-backup
setInterval(createAutoBackup, 60000 * 60); // Check every hour
createAutoBackup(); // Run once on startup
