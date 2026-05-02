// script.js - Image AI Editor Full HD
// ============================================
// CONFIGURATION
// ============================================
const API_CONFIG = {
    apiKey: 'YOUR_API_KEY_HERE',
    provider: 'openai',
    maxFileSize: 50 * 1024 * 1024, // 50MB
    maxWidth: 1024,
    maxHeight: 1024
};

// ============================================
// STATE MANAGEMENT
// ============================================
let appState = {
    originalImage: null,
    imageBase64: null,
    transformedImage: null,
    originalFileName: ''
};

// ============================================
// DOM ELEMENTS
// ============================================
const imageUpload = document.getElementById('imageUpload');
const editButton = document.getElementById('editButton');
const preview = document.getElementById('imagePreview');
const transformText = document.getElementById('transformationDescription');
const downloadButton = document.getElementById('downloadButton');
const statusMessage = document.getElementById('statusMessage');

// ============================================
// EVENT LISTENERS
// ============================================
imageUpload.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        // Validar tamaño
        if (file.size > API_CONFIG.maxFileSize) {
            showStatus('Error: Archivo demasiado grande. Máximo 50MB.', 'error');
            return;
        }
        // Validar tipo
        if (!file.type.startsWith('image/')) {
            showStatus('Error: Solo se permiten archivos de imagen.', 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            appState.imageBase64 = e.target.result;
            appState.originalImage = file;
            appState.originalFileName = file.name;
            preview.innerHTML = `<img src="${e.target.result}" alt="Original">`;
            editButton.disabled = false;
            showStatus('Imagen cargada correctamente.', 'success');
        };
        reader.readAsDataURL(file);
    }
});

// Botón transformar
editButton.addEventListener('click', async () => {
    const description = transformText.value.trim();
    if (!description) {
        showStatus('Error: Describe el cambio que quieres hacer.', 'error');
        return;
    }
    if (!appState.imageBase64) {
        showStatus('Error: Carga una imagen primero.', 'error');
        return;
    }
    if (API_CONFIG.apiKey === 'YOUR_API_KEY_HERE') {
        showStatus('Error: Configura tu API Key en script.js', 'error');
        return;
    }
    editButton.disabled = true;
    showStatus('Transformando imagen... esto puede tomar unos momentos.', 'success');
    try {
        const result = await transformWithOpenAI(description);
        if (result) {
            appState.transformedImage = result;
            preview.innerHTML += `<hr><img src="${result}" alt="Transformada">`;
            downloadButton.style.display = 'block';
            showStatus('Imagen transformada exitosamente.', 'success');
        }
    } catch (error) {
        showStatus('Error: ' + error.message, 'error');
        console.error('Error:', error);
    } finally {
        editButton.disabled = false;
    }
});

// ============================================
// OPENAI DALL-E 3 INTEGRATION
// ============================================
async function transformWithOpenAI(description) {
    try {
        // Convertir imagen a formato apropiado
        const imageBlob = base64ToBlob(appState.imageBase64);
        const formData = new FormData();
        formData.append('image', imageBlob, 'image.jpg');
        formData.append('prompt', description);
        formData.append('n', '1');
        formData.append('size', '1024x1024');
        formData.append('response_format', 'b64_json');
        const response = await fetch('https://api.openai.com/v1/images/edits', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_CONFIG.apiKey}`
            },
            body: formData
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Error en OpenAI API');
        }
        const data = await response.json();
        return `data:image/png;base64,${data.data[0].b64_image}`;
    } catch (error) {
        throw new Error('OpenAI: ' + error.message);
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function base64ToBlob(base64String) {
    const parts = base64String.split(';base64,');
    const imageData = atob(parts[1]);
    const byteNumbers = new Array(imageData.length);
    for (let i = 0; i < imageData.length; i++) {
        byteNumbers[i] = imageData.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/jpeg' });
}

function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message ' + type;
}

// ============================================
// DESCARGA
// ============================================
downloadButton.addEventListener('click', () => {
    if (appState.transformedImage) {
        const link = document.createElement('a');
        link.href = appState.transformedImage;
        link.download = `transformed-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showStatus('Descarga iniciada.', 'success');
    }
});

console.log('Image AI Editor Full HD - Ready');
console.log('API Key:', API_CONFIG.apiKey === 'YOUR_API_KEY_HERE' ? 'No configurada' : 'Configurada');