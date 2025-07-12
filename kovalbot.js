// KovalBot para Calendario Familiar

// Function to get calendar context for the chatbot
function getCalendarContext() {
    try {
        // Always use localStorage as primary source (most reliable and up-to-date)
        // Check multiple possible keys for each data type
        let eventsData = JSON.parse(localStorage.getItem('familyEvents') || localStorage.getItem('events') || '[]');
        
        // If no events found, check in emergencyBackup
        if (eventsData.length === 0) {
            const emergencyBackup = JSON.parse(localStorage.getItem('emergencyBackup') || '{}');
            if (emergencyBackup.familyEvents) {
                eventsData = emergencyBackup.familyEvents;
            } else if (emergencyBackup.events) {
                eventsData = emergencyBackup.events;
            }
        }
        
        let plansData = JSON.parse(localStorage.getItem('familyPlans') || localStorage.getItem('favoriteLists') || '[]');
        
        // If no plans found, check in emergencyBackup
        if (plansData.length === 0) {
            const emergencyBackup = JSON.parse(localStorage.getItem('emergencyBackup') || '{}');
            if (emergencyBackup.familyPlans) {
                plansData = emergencyBackup.familyPlans;
            } else if (emergencyBackup.favoriteLists) {
                plansData = emergencyBackup.favoriteLists;
            }
        }
        
        // Debug: Log what we found in plansData
        console.log('📋 PLANS DATA FOUND:', plansData.length, plansData);
        
        const menuData = JSON.parse(localStorage.getItem('weeklyMenu') || localStorage.getItem('menu') || '{}');
        const challengesData = JSON.parse(localStorage.getItem('familyChallenges') || localStorage.getItem('customChallenges') || localStorage.getItem('modifiedChallenges') || '[]');
        const inventoryData = JSON.parse(localStorage.getItem('homeInventory') || localStorage.getItem('shoppingList') || localStorage.getItem('cart') || '[]');
        const completedChallengesData = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
        const familyScoreData = parseInt(localStorage.getItem('familyScore') || '0');
        
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
        
        // Add current plans (check multiple sources)
        let plansToShow = plansData;
        let menuFavorites = [];
        
        // Debug: Log the structure we're working with
        console.log('📋 ANALYZING PLANS DATA:', plansToShow);
        
        // If plansData came from favoriteLists, separate ideas from menu favorites
        if (plansToShow.length > 0) {
            // Extract menu favorites (items with id, name, items structure)
            menuFavorites = plansToShow.filter(item => 
                item && typeof item === 'object' && 
                item.hasOwnProperty('id') && 
                item.hasOwnProperty('name') && 
                item.hasOwnProperty('items') &&
                Array.isArray(item.items)
            );
            
            console.log('📋 MENU FAVORITES DETECTED:', menuFavorites.length, menuFavorites);
            
            // Filter out menu favorites to get actual plans/ideas
            const actualPlans = plansToShow.filter(item => 
                !item || typeof item !== 'object' ||
                !item.hasOwnProperty('id') || 
                !item.hasOwnProperty('name') || 
                !item.hasOwnProperty('items') ||
                !Array.isArray(item.items)
            );
            
            console.log('💡 ACTUAL PLANS DETECTED:', actualPlans.length, actualPlans);
            
            if (actualPlans.length > 0) {
                context += "PLANES FAMILIARES (IDEAS):\n";
                actualPlans.forEach(plan => {
                    // Handle different data structures
                    if (typeof plan === 'string') {
                        context += `- ${plan}\n`;
                    } else if (plan && plan.title) {
                        context += `- ${plan.title}${plan.priority ? ' (Prioridad: ' + plan.priority + ')' : ''}${plan.description ? ' - ' + plan.description : ''}\n`;
                    } else if (plan && plan.name && !plan.items) {
                        context += `- ${plan.name}${plan.description ? ' - ' + plan.description : ''}\n`;
                    } else if (plan && plan.dish) {
                        // Skip menu items - these will be handled in menu section
                        return;
                    } else if (plan && typeof plan === 'object') {
                        // Try to extract meaningful info from object
                        const keys = Object.keys(plan);
                        const displayText = keys.map(key => `${key}: ${plan[key]}`).join(', ');
                        context += `- ${displayText}\n`;
                    }
                });
                context += "\n";
            } else {
                context += "PLANES FAMILIARES (IDEAS): No hay ideas guardadas actualmente\n\n";
            }
        } else {
            context += "PLANES FAMILIARES (IDEAS): No hay ideas guardadas actualmente\n\n";
        }
        
        // Show menu favorites properly
        if (menuFavorites.length > 0) {
            context += "LISTAS DE FAVORITOS DEL MENÚ:\n";
            menuFavorites.forEach(favList => {
                context += `📋 Lista: "${favList.name}" (${favList.items.length} items)\n`;
                if (favList.items.length > 0) {
                    favList.items.forEach(item => {
                        if (typeof item === 'string') {
                            context += `  - ${item}\n`;
                        } else if (item && item.dish) {
                            context += `  - ${item.dish}${item.ingredients ? ' (Ingredientes: ' + item.ingredients + ')' : ''}${item.cookTime ? ' (' + item.cookTime + ' min)' : ''}\n`;
                        } else if (item && item.name) {
                            context += `  - ${item.name}\n`;
                        } else if (item && typeof item === 'object') {
                            context += `  - ${JSON.stringify(item)}\n`;
                        } else {
                            context += `  - ${item}\n`;
                        }
                    });
                }
            });
            context += "\n";
        } else {
            context += "LISTAS DE FAVORITOS DEL MENÚ: No hay listas guardadas como favoritas actualmente\n\n";
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
            menuItems.forEach(item => {
                context += `- ${item.dish} (${item.cookTime || 'N/A'} min, Ingredientes: ${item.ingredients || 'No especificados'})\n`;
            });
            context += "\n";
        } else {
            context += "MENÚ SEMANAL: No hay platos programados actualmente\n\n";
        }
        
        // Add inventory items (handle different data structures)
        if (inventoryData.length > 0) {
            context += "INVENTARIO ACTUAL:\n";
            inventoryData.forEach(item => {
                // Handle different data structures
                if (typeof item === 'string') {
                    context += `- ${item}\n`;
                } else if (item.name) {
                    const quantity = item.quantity || 1;
                    const quantityText = quantity === 1 ? `QUEDA ${quantity} unidad` : `QUEDAN ${quantity} unidades`;
                    context += `- ${item.name}: ${quantityText}${item.category ? ' (Categoría: ' + item.category + ')' : ''}\n`;
                } else if (item.title) {
                    const amount = item.amount || item.quantity || 1;
                    const amountText = amount === 1 ? `QUEDA ${amount}` : `QUEDAN ${amount}`;
                    context += `- ${item.title}: ${amountText}\n`;
                } else {
                    context += `- ${JSON.stringify(item)}\n`;
                }
            });
            context += "\n";
        } else {
            context += "INVENTARIO ACTUAL: No hay items en el inventario actualmente\n\n";
        }
        
        // Add completed challenges and family score
        if (completedChallengesData.length > 0) {
            context += "RETOS COMPLETADOS RECIENTEMENTE:\n";
            completedChallengesData.slice(-3).forEach(challenge => {
                context += `- ${challenge.title} (Completado por: ${challenge.assignedTo})\n`;
            });
            context += "\n";
        }
        
        if (familyScoreData > 0) {
            context += `PUNTUACIÓN FAMILIAR ACTUAL: ${familyScoreData} puntos\n\n`;
        }
        
        return context || "No hay información específica del calendario disponible en este momento.";
    } catch (error) {
        console.error('Error getting calendar context:', error);
        return "Error al acceder a la información del calendario.";
    }
}

// Enhanced debug function to check both localStorage AND global variables
function debugKovalBotData() {
    console.log('🔍=== KOVALBOT ENHANCED DEBUG ===🔍');
    
    // Check all localStorage keys first
    const allKeys = Object.keys(localStorage);
    console.log('📋 ALL LOCALSTORAGE KEYS:', allKeys);
    
    // Show raw values in localStorage
    console.log('📦 RAW LOCALSTORAGE VALUES:');
    allKeys.forEach(key => {
        const value = localStorage.getItem(key);
        console.log(`- ${key}:`, value ? value.substring(0, 100) + (value.length > 100 ? '...' : '') : 'null');
    });
    
    // Check localStorage data with proper parsing
    let lsEvents = JSON.parse(localStorage.getItem('familyEvents') || localStorage.getItem('events') || '[]');
    let lsPlans = JSON.parse(localStorage.getItem('familyPlans') || localStorage.getItem('favoriteLists') || '[]');
    
    // Debug: Show what we found
    console.log('📊 RAW DATA FOUND:');
    console.log('- lsEvents:', lsEvents.length, lsEvents);
    console.log('- lsPlans (from favoriteLists):', lsPlans.length, lsPlans);
    
    // Separate menu favorites from regular plans
    const menuFavorites = lsPlans.filter(item => 
        item && typeof item === 'object' && 
        item.hasOwnProperty('id') && 
        item.hasOwnProperty('name') && 
        item.hasOwnProperty('items') &&
        Array.isArray(item.items)
    );
    
    const actualPlans = lsPlans.filter(item => 
        !item || typeof item !== 'object' ||
        !item.hasOwnProperty('id') || 
        !item.hasOwnProperty('name') || 
        !item.hasOwnProperty('items') ||
        !Array.isArray(item.items)
    );
    
    console.log('📋 SEPARATED DATA:');
    console.log('- Menu Favorites:', menuFavorites.length, menuFavorites);
    console.log('- Actual Plans:', actualPlans.length, actualPlans);
    
    // Check emergencyBackup for events and plans if not found
    if (lsEvents.length === 0 || lsPlans.length === 0) {
        const emergencyBackup = JSON.parse(localStorage.getItem('emergencyBackup') || '{}');
        console.log('📦 EMERGENCY BACKUP CONTENTS:', emergencyBackup);
        
        if (lsEvents.length === 0 && emergencyBackup.familyEvents) {
            lsEvents = emergencyBackup.familyEvents;
            console.log('🔄 Using events from emergencyBackup:', lsEvents.length);
        }
        
        if (lsPlans.length === 0 && emergencyBackup.familyPlans) {
            lsPlans = emergencyBackup.familyPlans;
            console.log('🔄 Using plans from emergencyBackup:', lsPlans.length);
        }
    }
    
    const lsMenu = JSON.parse(localStorage.getItem('weeklyMenu') || localStorage.getItem('menu') || '{}');
    const lsChallenges = JSON.parse(localStorage.getItem('familyChallenges') || localStorage.getItem('customChallenges') || localStorage.getItem('modifiedChallenges') || '[]');
    const lsInventory = JSON.parse(localStorage.getItem('homeInventory') || localStorage.getItem('shoppingList') || localStorage.getItem('cart') || '[]');
    const lsCompleted = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
    const lsScore = localStorage.getItem('familyScore') || '0';
    const lsFavorites = JSON.parse(localStorage.getItem('favoriteLists') || '[]');
    
    console.log('📱 PARSED LOCALSTORAGE DATA:');
    console.log('Events:', lsEvents.length, lsEvents);
    console.log('Plans (actual ideas):', actualPlans.length, actualPlans);
    console.log('Menu Favorites:', menuFavorites.length, menuFavorites);
    console.log('Menu:', Object.keys(lsMenu).length, lsMenu);
    console.log('Challenges (custom/modified):', lsChallenges.length, lsChallenges);
    console.log('Inventory (from shoppingList/cart):', lsInventory.length, lsInventory);
    console.log('Completed challenges:', lsCompleted.length, lsCompleted);
    console.log('Family score:', lsScore);
    console.log('Favorites:', lsFavorites.length, lsFavorites);
    
    // Test individual alternative keys
    console.log('🔍 TESTING ALTERNATIVE KEYS:');
    const testKeys = ['favoriteLists', 'shoppingList', 'cart', 'customChallenges', 'modifiedChallenges', 'emergencyBackup'];
    testKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
            try {
                const parsed = JSON.parse(value);
                console.log(`${key}:`, Array.isArray(parsed) ? `${parsed.length} items` : `${Object.keys(parsed).length} keys`, parsed);
                
                // Show first few items for arrays
                if (Array.isArray(parsed) && parsed.length > 0) {
                    console.log(`  First items in ${key}:`, parsed.slice(0, 3));
                    
                    // Special analysis for favoriteLists
                    if (key === 'favoriteLists') {
                        console.log('  🔍 ANALYZING FAVORITELISTS STRUCTURE:');
                        const menuFavorites = parsed.filter(item => item.id && item.name && item.items);
                        const otherItems = parsed.filter(item => !item.id || !item.name || !item.items);
                        
                        console.log(`    Menu Favorites: ${menuFavorites.length} lists`);
                        menuFavorites.forEach((list, index) => {
                            console.log(`      List ${index}: "${list.name}" with ${list.items.length} items`);
                        });
                        
                        console.log(`    Other items: ${otherItems.length}`);
                        otherItems.forEach((item, index) => {
                            console.log(`      Item ${index}:`, typeof item, item);
                            if (typeof item === 'object' && item !== null) {
                                console.log(`        Keys: [${Object.keys(item).join(', ')}]`);
                            }
                        });
                    }
                }
                
                // Show object structure for objects
                if (!Array.isArray(parsed) && typeof parsed === 'object') {
                    console.log(`  Object keys in ${key}:`, Object.keys(parsed));
                    Object.keys(parsed).forEach(subKey => {
                        console.log(`    ${subKey}:`, typeof parsed[subKey], Array.isArray(parsed[subKey]) ? `${parsed[subKey].length} items` : parsed[subKey]);
                    });
                }
            } catch (e) {
                console.log(`${key}:`, 'Not JSON', value.substring(0, 100));
            }
        } else {
            console.log(`${key}:`, 'Empty or null');
        }
    });
    
    // Check global variables
    console.log('🌐 GLOBAL VARIABLES:');
    console.log('events (global):', typeof events !== 'undefined' ? events.length + ' items' : 'undefined', typeof events !== 'undefined' ? events : 'N/A');
    console.log('plans (global):', typeof plans !== 'undefined' ? plans.length + ' items' : 'undefined', typeof plans !== 'undefined' ? plans : 'N/A');
    console.log('inventory (global):', typeof inventory !== 'undefined' ? inventory.length + ' items' : 'undefined', typeof inventory !== 'undefined' ? inventory : 'N/A');
    console.log('weeklyMenu (global):', typeof weeklyMenu !== 'undefined' ? Object.keys(weeklyMenu).length + ' items' : 'undefined', typeof weeklyMenu !== 'undefined' ? weeklyMenu : 'N/A');
    console.log('familyScore (global):', typeof familyScore !== 'undefined' ? familyScore : 'undefined');
    console.log('favoriteLists (global):', typeof favoriteLists !== 'undefined' ? favoriteLists.length + ' items' : 'undefined', typeof favoriteLists !== 'undefined' ? favoriteLists : 'N/A');
    
    // Look for alternative storage keys
    console.log('🔍 ALTERNATIVE STORAGE KEYS:');
    const inventoryKeys = allKeys.filter(k => k.toLowerCase().includes('inventor') || k.toLowerCase().includes('items'));
    const eventKeys = allKeys.filter(k => k.toLowerCase().includes('event') || k.toLowerCase().includes('calendar'));
    const planKeys = allKeys.filter(k => k.toLowerCase().includes('plan') || k.toLowerCase().includes('idea'));
    console.log('Inventory-related keys:', inventoryKeys);
    console.log('Event-related keys:', eventKeys);
    console.log('Plan-related keys:', planKeys);
    
    // Look for cheese specifically in multiple places
    const cheese = lsInventory.filter(item => {
        if (typeof item === 'string') {
            return item.toLowerCase().includes('queso');
        } else if (item.name) {
            return item.name.toLowerCase().includes('queso');
        } else if (item.title) {
            return item.title.toLowerCase().includes('queso');
        }
        return false;
    });
    console.log('🧀 CHEESE SEARCH:');
    console.log('Cheese items in localStorage inventory:', cheese);
    
    // Check if there might be data under different keys
    inventoryKeys.forEach(key => {
        try {
            const data = JSON.parse(localStorage.getItem(key) || '[]');
            if (Array.isArray(data)) {
                const cheeseInAlt = data.filter(item => item.name && item.name.toLowerCase().includes('queso'));
                if (cheeseInAlt.length > 0) {
                    console.log(`Cheese found in ${key}:`, cheeseInAlt);
                }
            }
        } catch (e) {
            console.log(`Could not parse ${key} as JSON`);
        }
    });
    
    console.log('🔍=== END ENHANCED DEBUG ===🔍');
    
    return {
        events: lsEvents.length,
        plans: actualPlans.length,
        inventory: lsInventory.length,
        cheese: cheese.length,
        menuFavorites: menuFavorites.length,
        allKeys: allKeys,
        localStorage: {
            events: lsEvents,
            plans: actualPlans,
            menuFavorites: menuFavorites,
            inventory: lsInventory,
            score: lsScore,
            favorites: lsFavorites
        }
    };
}

// Function to clear old data and force fresh sync
function clearOldDataAndSync() {
    // Clear old localStorage data
    localStorage.removeItem('homeInventory');
    localStorage.removeItem('familyEvents');
    localStorage.removeItem('familyPlans');
    localStorage.removeItem('weeklyMenu');
    localStorage.removeItem('familyChallenges');
    localStorage.removeItem('completedChallenges');
    localStorage.removeItem('familyScore');
    localStorage.removeItem('lastUpdated');
    
    console.log('🧹 Old localStorage data cleared');
    
    // Force a fresh sync from cloud
    JSONBinAPI.syncData(true).then(() => {
        console.log('🔄 Fresh sync completed');
        
        // Refresh current page data if render functions exist
        if (typeof renderInventory === 'function') renderInventory();
        if (typeof renderPlans === 'function') renderPlans();
        if (typeof renderCalendar === 'function') renderCalendar();
        if (typeof renderEvents === 'function') renderEvents();
    });
}

// Function to initialize KovalBot and check data
function initializeKovalBot() {
    console.log('🤖 Initializing KovalBot...');
    
    // Wait a bit for page to load and data to sync
    setTimeout(() => {
        const debugInfo = debugKovalBotData();
        const totalItems = debugInfo.events + debugInfo.plans + debugInfo.inventory;
        
        if (totalItems === 0) {
            console.log('⚠️ KovalBot: No data found in localStorage');
            console.log('💡 Suggestion: Use /sync command to load data from cloud');
            
            // Show a one-time notification in the chatbot if it's open
            const messages = document.getElementById('chatbot-messages');
            if (messages && messages.innerHTML.trim() === '') {
                messages.innerHTML = `<div><b>🤖 KovalBot:</b> ¡Hola! Soy tu asistente IA versátil. Puedo responder cualquier pregunta como ChatGPT Y también ayudarte con tu aplicación familiar.<br><br>
                    📊 Datos familiares: Cargando...<br>
                    Prueba <strong>/sync</strong> para cargar datos o <strong>/help</strong> para ver todo lo que puedo hacer.<br><br>
                    💬 ¡Pregúntame cualquier cosa!</div>`;
            }
        } else {
            console.log(`✅ KovalBot: Found ${totalItems} total items in localStorage`);
        }
    }, 2000);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeKovalBot);
} else {
    initializeKovalBot();
}

async function sendChatbotMessage() {
    const input = document.getElementById('chatbot-input');
    const messages = document.getElementById('chatbot-messages');
    const userMessage = input.value.trim();
    if (!userMessage) return;

    // Special help command
    if (userMessage.toLowerCase() === '/help') {
        messages.innerHTML += `<div><b>Tú:</b> ${userMessage}</div>`;
        messages.innerHTML += `<div><b>🤖 KovalBot - Asistente IA Versátil:</b><br><br>
            <strong>🎯 ¿Qué puedo hacer?</strong><br>
            • Responder CUALQUIER pregunta como ChatGPT<br>
            • Ayudar con tareas, estudios, consejos, curiosidades<br>
            • Matemáticas, ciencia, historia, tecnología<br>
            • Recetas de cocina, ejercicio, entretenimiento<br>
            • Información sobre tu aplicación familiar<br><br>
            
            <strong>🔧 Comandos especiales:</strong><br>
            <strong>/debug</strong> - Datos que puedo ver de tu app<br>
            <strong>/sync</strong> - Sincronizar desde la nube<br>
            <strong>/clear</strong> - Limpiar y resincronizar datos<br>
            <strong>/backup</strong> - Ver backup de emergencia<br>
            <strong>/analyze</strong> - Analizar estructura de ideas y favoritos<br>
            <strong>/favoritos</strong> - Ver solo tus listas de favoritos<br>
            <strong>/help</strong> - Esta ayuda<br><br>
            
            <strong>👨‍👩‍👧‍👦 Sobre tu familia puedo decirte:</strong><br>
            • Eventos del calendario familiar<br>
            • Ideas y planes familiares<br>
            • Inventario completo de la casa<br>
            • Mini-retos familiares activos<br>
            • Menú semanal con detalles<br>
            • Puntuación familiar actual<br><br>
            
            <small>💡 ¡Pregúntame lo que quieras! Desde "¿qué hay en mi inventario?" hasta "¿cómo funciona la fotosíntesis?"</small>
        </div>`;
        input.value = '';
        messages.scrollTop = messages.scrollHeight;
        return;
    }
    
    // Special backup command
    if (userMessage.toLowerCase() === '/backup') {
        const emergencyBackup = JSON.parse(localStorage.getItem('emergencyBackup') || '{}');
        messages.innerHTML += `<div><b>Tú:</b> ${userMessage}</div>`;
        messages.innerHTML += `<div><b>🗄️ Backup de Emergencia:</b><br>
            <textarea readonly style="width:100%; height:300px; font-size:10px; font-family:monospace;">${JSON.stringify(emergencyBackup, null, 2)}</textarea><br>
            <small>💡 Este backup contiene datos que podrían no estar sincronizados</small>
        </div>`;
        input.value = '';
        messages.scrollTop = messages.scrollHeight;
        return;
    }
    
    // Special command to analyze ideas and favorites
    if (userMessage.toLowerCase() === '/analyze') {
        const favoriteLists = JSON.parse(localStorage.getItem('favoriteLists') || '[]');
        const menuFavorites = favoriteLists.filter(item => 
            item && typeof item === 'object' && 
            item.hasOwnProperty('id') && 
            item.hasOwnProperty('name') && 
            item.hasOwnProperty('items') &&
            Array.isArray(item.items)
        );
        const otherItems = favoriteLists.filter(item => 
            !item || typeof item !== 'object' ||
            !item.hasOwnProperty('id') || 
            !item.hasOwnProperty('name') || 
            !item.hasOwnProperty('items') ||
            !Array.isArray(item.items)
        );
        
        messages.innerHTML += `<div><b>Tú:</b> ${userMessage}</div>`;
        messages.innerHTML += `<div><b>🔍 Análisis de Ideas y Favoritos:</b><br>
            <strong>Total en favoriteLists: ${favoriteLists.length} items</strong><br><br>
            
            <strong>📋 Listas de Favoritos del Menú: ${menuFavorites.length}</strong><br>
            ${menuFavorites.map(list => `• "${list.name}" (${list.items.length} items)<br>${list.items.map(item => `&nbsp;&nbsp;- ${typeof item === 'string' ? item : (item.dish || item.name || JSON.stringify(item))}`).join('<br>')}`).join('<br><br>')}<br><br>
            
            <strong>💡 Ideas/Otros: ${otherItems.length}</strong><br>
            ${otherItems.map(item => `• ${typeof item === 'string' ? item : JSON.stringify(item)}`).join('<br>')}<br><br>
            
            <strong>Estructura completa:</strong><br>
            <textarea readonly style="width:100%; height:150px; font-size:10px; font-family:monospace;">${JSON.stringify(favoriteLists, null, 2)}</textarea><br>
            
            <small>💡 Los favoritos del menú tienen estructura: {id, name, items}</small>
        </div>`;
        input.value = '';
        messages.scrollTop = messages.scrollHeight;
        return;
    }
    
    // Special command to check favorites specifically
    if (userMessage.toLowerCase() === '/favoritos') {
        const favoriteLists = JSON.parse(localStorage.getItem('favoriteLists') || '[]');
        const menuFavorites = favoriteLists.filter(item => 
            item && typeof item === 'object' && 
            item.hasOwnProperty('id') && 
            item.hasOwnProperty('name') && 
            item.hasOwnProperty('items') &&
            Array.isArray(item.items)
        );
        
        messages.innerHTML += `<div><b>Tú:</b> ${userMessage}</div>`;
        if (menuFavorites.length > 0) {
            messages.innerHTML += `<div><b>📋 Tus Listas de Favoritos (${menuFavorites.length}):</b><br><br>`;
            menuFavorites.forEach(list => {
                messages.innerHTML += `<strong>"${list.name}"</strong> (${list.items.length} items):<br>`;
                list.items.forEach(item => {
                    const itemName = typeof item === 'string' ? item : (item.dish || item.name || JSON.stringify(item));
                    messages.innerHTML += `• ${itemName}<br>`;
                });
                messages.innerHTML += `<br>`;
            });
            messages.innerHTML += `</div>`;
        } else {
            messages.innerHTML += `<div><b>📋 Favoritos:</b> No tienes listas guardadas como favoritas actualmente.</div>`;
        }
        input.value = '';
        messages.scrollTop = messages.scrollHeight;
        return;
    }

    // Special debug command
    if (userMessage.toLowerCase() === '/debug') {
        const debugInfo = debugKovalBotData();
        const context = getCalendarContext();
        const lastUpdated = localStorage.getItem('lastUpdated') || 'Nunca';
        
        messages.innerHTML += `<div><b>Tú:</b> ${userMessage}</div>`;
        messages.innerHTML += `<div><b>🔍 KovalBot Debug:</b><br>
            📊 <strong>Datos encontrados en localStorage:</strong><br>
            - Eventos: ${debugInfo.events} items<br>
            - Ideas: ${debugInfo.plans} items<br>
            - Inventario: ${debugInfo.inventory} items<br>
            - Queso específicamente: ${debugInfo.cheese} items<br>
            - 📋 Favoritos del Menú: ${debugInfo.menuFavorites} listas<br><br>
            
            🕒 <strong>Última actualización:</strong> ${lastUpdated}<br><br>
            
            📋 <strong>Todas las claves en localStorage:</strong><br>
            ${debugInfo.allKeys.join(', ')}<br><br>
            
            📝 <strong>Contexto que envío al backend:</strong><br>
            <textarea readonly style="width:100%; height:200px; font-size:11px; font-family:monospace;">${context}</textarea><br>
            
            💡 <strong>Instrucciones:</strong><br>
            • Si ves 0 items pero sabes que hay datos, usa /sync<br>
            • Si /sync no funciona, usa /clear<br>
            • Verifica la consola del navegador (F12) para más detalles<br>
            • Si el problema persiste, los datos podrían estar bajo claves diferentes
        </div>`;
        input.value = '';
        messages.scrollTop = messages.scrollHeight;
        return;
    }
    
    // Special clear command
    if (userMessage.toLowerCase() === '/clear') {
        messages.innerHTML += `<div><b>Tú:</b> ${userMessage}</div>`;
        messages.innerHTML += `<div><b>KovalBot:</b> 🧹 Limpiando datos antiguos y sincronizando...</div>`;
        clearOldDataAndSync();
        setTimeout(() => {
            messages.innerHTML += `<div><b>KovalBot:</b> ✅ Datos actualizados! Ahora uso solo los datos de esta página.</div>`;
            messages.scrollTop = messages.scrollHeight;
        }, 2000);
        input.value = '';
        messages.scrollTop = messages.scrollHeight;
        return;
    }
    
    // Special sync command
    if (userMessage.toLowerCase() === '/sync') {
        messages.innerHTML += `<div><b>Tú:</b> ${userMessage}</div>`;
        messages.innerHTML += `<div><b>KovalBot:</b> 🔄 Sincronizando datos desde la nube...</div>`;
        
        // Force a sync from cloud
        if (typeof JSONBinAPI !== 'undefined') {
            JSONBinAPI.syncData(true).then(() => {
                setTimeout(() => {
                    const debugInfo = debugKovalBotData();
                    messages.innerHTML += `<div><b>KovalBot:</b> ✅ Sincronización completada!<br>
                        📊 Datos después del sync:<br>
                        - Eventos: ${debugInfo.events}<br>
                        - Ideas: ${debugInfo.plans}<br>
                        - Inventario: ${debugInfo.inventory}<br>
                        Usa /debug para ver más detalles.</div>`;
                    messages.scrollTop = messages.scrollHeight;
                }, 1000);
            }).catch(error => {
                messages.innerHTML += `<div><b>KovalBot:</b> ❌ Error en la sincronización: ${error.message}</div>`;
                messages.scrollTop = messages.scrollHeight;
            });
        } else {
            messages.innerHTML += `<div><b>KovalBot:</b> ❌ JSONBinAPI no está disponible en esta página.</div>`;
            messages.scrollTop = messages.scrollHeight;
        }
        
        input.value = '';
        messages.scrollTop = messages.scrollHeight;
        return;
    }
    
    messages.innerHTML += `<div><b>Tú:</b> ${userMessage}</div>`;
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
    
    // Show loading indicator
    messages.innerHTML += `<div id="loading-message"><b>KovalBot:</b> <em>Escribiendo...</em></div>`;
    messages.scrollTop = messages.scrollHeight;
    
    try {
        // Debug: Show what data KovalBot can see
        const debugInfo = debugKovalBotData();
        
        // Include calendar context with the message
        const calendarContext = getCalendarContext();
        console.log('KovalBot Context being sent:', calendarContext);
        console.log('Context length:', calendarContext.length);
        const messageWithContext = `Eres KovalBot, un asistente de IA inteligente y versátil para la familia Delgado. Puedes responder CUALQUIER pregunta como lo haría ChatGPT - preguntas generales, ayuda con tareas, conocimiento de cualquier tema, conversación casual, etc. ADEMÁS tienes acceso completo a toda la información de la aplicación familiar.

INFORMACIÓN ACTUAL DE LA APLICACIÓN FAMILIAR:
${calendarContext}

INSTRUCCIONES:
- Responde CUALQUIER pregunta como un asistente de IA general (como ChatGPT)
- Para preguntas específicas sobre la familia, usa la información de arriba
- Puedes ayudar con: tareas escolares, consejos, información general, matemáticas, ciencia, historia, tecnología, recetas, ejercicio, entretenimiento, etc.
- Sé conversacional, útil, inteligente y amigable
- Si preguntan sobre la aplicación familiar o datos específicos, usa la información exacta de arriba
- Si preguntan algo general que no está en los datos familiares, responde con tu conocimiento general
- Siempre responde en español a menos que te pidan específicamente otro idioma
- Puedes hacer sugerencias creativas combinando tu conocimiento general con los datos familiares

INTERPRETACIÓN ESPECÍFICA DE DATOS FAMILIARES:
- Cuando veas "QUEDA 1 unidad" significa que solo hay 1 de ese artículo disponible
- Cuando veas "QUEDAN X unidades" significa que hay X cantidad de ese artículo
- Las ideas familiares pueden estar en la sección "PLANES FAMILIARES (IDEAS)"
- Los favoritos del menú pueden estar en "LISTAS DE FAVORITOS DEL MENÚ"
- Si no ves ideas o favoritos, significa que no hay datos guardados actualmente

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
    
    // Check if chatbot was previously open (preserve state between pages)
    const chatbotBody = document.getElementById('chatbot-body');
    const chatbotHeader = document.getElementById('chatbot-header');
    
    if (chatbotBody && chatbotHeader) {
        // Get previous state from localStorage
        const wasOpen = localStorage.getItem('kovalbot-open') === 'true';
        
        if (wasOpen) {
            // Keep chatbot open
            chatbotBody.style.display = 'block';
            chatbotHeader.style.borderRadius = '10px 10px 0 0';
            chatbotBody.style.borderRadius = '0 0 10px 10px';
        } else {
            // Keep chatbot closed
            chatbotBody.style.display = 'none';
            chatbotHeader.style.borderRadius = '10px';
        }
    }
});

function toggleChatbot() {
    const chatbotBody = document.getElementById('chatbot-body');
    const chatbotHeader = document.getElementById('chatbot-header');
    
    if (chatbotBody.style.display === 'none') {
        chatbotBody.style.display = 'block';
        chatbotHeader.style.borderRadius = '10px 10px 0 0';
        chatbotBody.style.borderRadius = '0 0 10px 10px';
        
        // Save open state
        localStorage.setItem('kovalbot-open', 'true');
        
        // Add welcome message if empty
        const messages = document.getElementById('chatbot-messages');
        if (messages.innerHTML.trim() === '') {
            messages.innerHTML = '<div><b>KovalBot:</b> ¡Hola! Papá, Mamá, Samuel y Adaline, soy KovalBot. Puedo ayudarles con lo que necesiten. ¿En qué puedo ayudarte?</div>';
        }
    } else {
        chatbotBody.style.display = 'none';
        chatbotHeader.style.borderRadius = '10px';
        
        // Save closed state
        localStorage.setItem('kovalbot-open', 'false');
    }
}
