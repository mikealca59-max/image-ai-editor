const imageUpload = document.getElementById('imageUpload');
const editButton = document.getElementById('editButton');
const preview = document.getElementById('imagePreview');

// Mostrar vista previa de la imagen seleccionada
imageUpload.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        }
        reader.readAsDataURL(file);
    }
});

editButton.addEventListener('click', async () => {
    const description = document.getElementById('transformationDescription').value;
    if (!description) return alert("Por favor, describe el cambio.");

    alert("Enviando a la IA... (Asegúrate de configurar tu API Key en script.js)");
    
    // Aquí iría la llamada a la API (OpenAI o Alibaba)
    // const apiKey = 'TU_LLAVE_AQUÍ'; 
});