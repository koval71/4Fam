// JSONBin Configuration
const JSONBIN_CONFIG = {
    binId: '68704bfb6063391d31ab29de',
    masterKey: '$2a$10$t8neqkrZsYHUnLjn0jNN1OcAnT8b1EaXvZGogRyxWxW0fmUgQhVRO',
    baseUrl: 'https://api.jsonbin.io/v3'
};

// JSONBin API functions
class JSONBinAPI {
    static async loadData() {
        try {
            console.log('🔄 Cargando datos desde JSONBin...');
            
            const response = await fetch(`${JSONBIN_CONFIG.baseUrl}/b/${JSONBIN_CONFIG.binId}/latest`, {
                method: 'GET',
                headers: {
                    'X-Master-Key': JSONBIN_CONFIG.masterKey,
                    'X-Bin-Meta': 'false'
                }
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Datos cargados desde JSONBin:', data);
            return data;
        } catch (error) {
            console.error('❌ Error cargando datos desde JSONBin:', error);
            // Fallback to localStorage if JSONBin fails
            return {
                familyEvents: JSON.parse(localStorage.getItem('familyEvents') || '[]'),
                familyPlans: JSON.parse(localStorage.getItem('familyPlans') || '[]'),
                weeklyMenu: JSON.parse(localStorage.getItem('weeklyMenu') || '[]'),
                shoppingList: JSON.parse(localStorage.getItem('shoppingList') || '[]'),
                favoriteLists: JSON.parse(localStorage.getItem('favoriteLists') || '[]'),
                homeInventory: JSON.parse(localStorage.getItem('homeInventory') || '[]'),
                familyChallenges: JSON.parse(localStorage.getItem('familyChallenges') || '[]'),
                currentChallenge: JSON.parse(localStorage.getItem('currentChallenge') || 'null'),
                completedChallenges: JSON.parse(localStorage.getItem('completedChallenges') || '[]'),
                familyScore: parseInt(localStorage.getItem('familyScore') || '0'),
                customChallenges: JSON.parse(localStorage.getItem('customChallenges') || '[]'),
                modifiedChallenges: JSON.parse(localStorage.getItem('modifiedChallenges') || '[]'),
                deletedChallenges: JSON.parse(localStorage.getItem('deletedChallenges') || '[]'),
                lastUpdated: new Date().toISOString()
            };
        }
    }

    static async saveData(data) {
        try {
            console.log('💾 Guardando datos en JSONBin...');
            
            // Add timestamp
            data.lastUpdated = new Date().toISOString();
            
            const response = await fetch(`${JSONBIN_CONFIG.baseUrl}/b/${JSONBIN_CONFIG.binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': JSONBIN_CONFIG.masterKey
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Datos guardados en JSONBin:', result);
            
            // Also save to localStorage as backup
            Object.keys(data).forEach(key => {
                if (key !== 'lastUpdated') {
                    localStorage.setItem(key, JSON.stringify(data[key]));
                }
            });
            
            return result;
        } catch (error) {
            console.error('❌ Error guardando datos en JSONBin:', error);
            
            // Fallback to localStorage if JSONBin fails
            Object.keys(data).forEach(key => {
                if (key !== 'lastUpdated') {
                    localStorage.setItem(key, JSON.stringify(data[key]));
                }
            });
            
            throw error;
        }
    }

    static async syncData() {
        try {
            const cloudData = await this.loadData();
            
            // Update global variables with cloud data
            events = cloudData.familyEvents || [];
            plans = cloudData.familyPlans || [];
            weeklyMenu = cloudData.weeklyMenu || [];
            shoppingList = cloudData.shoppingList || [];
            favoriteLists = cloudData.favoriteLists || [];
            inventory = cloudData.homeInventory || [];
            challenges = cloudData.familyChallenges || [];
            currentChallenge = cloudData.currentChallenge || null;
            completedChallenges = cloudData.completedChallenges || [];
            familyScore = cloudData.familyScore || 0;
            customChallenges = cloudData.customChallenges || [];
            modifiedChallenges = cloudData.modifiedChallenges || [];
            deletedChallenges = cloudData.deletedChallenges || [];
            
            console.log('🔄 Datos sincronizados desde la nube');
            
            // Refresh UI if elements exist
            if (typeof renderCalendar === 'function') renderCalendar();
            if (typeof renderEvents === 'function') renderEvents();
            if (typeof renderPlans === 'function') renderPlans();
            if (typeof renderWeeklyMenu === 'function') renderWeeklyMenu();
            if (typeof renderShoppingList === 'function') renderShoppingList();
            if (typeof renderFavoriteLists === 'function') renderFavoriteLists();
            if (typeof renderInventory === 'function') renderInventory();
            if (typeof renderCurrentChallenge === 'function') renderCurrentChallenge();
            if (typeof renderChallengesList === 'function') renderChallengesList();
            if (typeof renderFamilyScore === 'function') renderFamilyScore();
            
        } catch (error) {
            console.error('❌ Error sincronizando datos:', error);
        }
    }

    static async saveAllData() {
        try {
            const data = {
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
                deletedChallenges: deletedChallenges
            };
            
            await this.saveData(data);
            showNotification('📡 Datos sincronizados con la nube', 'success');
        } catch (error) {
            console.error('❌ Error guardando todos los datos:', error);
            showNotification('⚠️ Error sincronizando. Datos guardados localmente.', 'warning');
        }
    }
}

// Auto-sync every 30 seconds to check for updates from other devices
setInterval(async () => {
    try {
        await JSONBinAPI.syncData();
    } catch (error) {
        console.log('Sync silently failed, continuing...');
    }
}, 30000);
