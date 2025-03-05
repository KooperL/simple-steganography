// JavaScript functions specific to the encode page

function loadSampleText() {
    document.getElementById('inputText').value = "The quick brown fox jumps over the lazy dog";
    document.getElementById('hiddenData').value = "Hello";
    validateInput();
}

function validateInput() {
    const inputText = document.getElementById('inputText').value;
    const hiddenData = document.getElementById('hiddenData').value;
    const encodeButton = document.getElementById('encodeButton');
    const availableSpaces = document.getElementById('availableSpaces');
    const requiredSpaces = document.getElementById('requiredSpaces');
    const maxCharacters = document.getElementById('maxCharacters');
    const feedback = document.getElementById('feedback');
    
    if (!inputText.trim() || !hiddenData.trim()) {
        encodeButton.disabled = true;
        availableSpaces.textContent = '0';
        requiredSpaces.textContent = '0';
        maxCharacters.textContent = '0';
        feedback.textContent = '';
        feedback.className = 'feedback';
        return;
    }
    
    // Count available spaces
    const spaces = inputText.match(/\s+/g) || [];
    const available = spaces.length;
    
    // Calculate required spaces (8 bits per character)
    const required = hiddenData.length * 8;
    
    // Calculate maximum characters that can be encoded
    const maxChars = Math.floor(available / 8);
    
    availableSpaces.textContent = available;
    requiredSpaces.textContent = required;
    maxCharacters.textContent = maxChars;
    
    if (required > available) {
        availableSpaces.className = 'stat-value error';
        requiredSpaces.className = 'stat-value error';
        maxCharacters.className = 'stat-value error';
        feedback.textContent = `Error: Not enough spaces to encode message. Need ${required} spaces but only have ${available}.`;
        feedback.className = 'feedback error';
        encodeButton.disabled = true;
    } else {
        availableSpaces.className = 'stat-value success';
        requiredSpaces.className = 'stat-value success';
        maxCharacters.className = 'stat-value success';
        feedback.textContent = `Success: Message can be encoded with ${available - required} spaces remaining.`;
        feedback.className = 'feedback success';
        encodeButton.disabled = false;
    }
    
    updateBinaryPreview();
    updateSpacePreview();
}

function updateBinaryPreview() {
    const hiddenData = document.getElementById('hiddenData').value;
    const binaryPreview = document.getElementById('binaryPreview');
    
    if (hiddenData.trim()) {
        const binaryData = hiddenData.split('').map(char => 
            char.charCodeAt(0).toString(2).padStart(8, '0')
        ).join(' ');
        binaryPreview.textContent = binaryData;
    } else {
        binaryPreview.textContent = '';
    }
}

function updateSpacePreview() {
    const text = document.getElementById('inputText').value;
    const hiddenData = document.getElementById('hiddenData').value;
    const spacePreview = document.getElementById('spacePreview');
    
    if (text.trim()) {
        // Convert hidden data to binary
        const binaryData = hiddenData.split('').map(char => 
            char.charCodeAt(0).toString(2).padStart(8, '0')
        ).join('');
        
        // Split text into parts
        const parts = text.split(/(\s+)/);
        let binaryIndex = 0;
        
        const preview = parts.map(part => {
            if (part.trim() === '') {
                // If we have binary data to encode, show the appropriate space
                if (binaryIndex < binaryData.length) {
                    const isDouble = binaryData[binaryIndex] === '1';
                    binaryIndex++;
                    return `<span class="space-preview${isDouble ? ' double' : ''} highlight"></span>`;
                }
                return `<span class="space-preview"></span>`;
            }
            return part;
        }).join('');
        
        spacePreview.innerHTML = preview;
    } else {
        spacePreview.innerHTML = '';
    }
}

function encodeBinary() {
    const inputText = document.getElementById('inputText').value;
    const hiddenData = document.getElementById('hiddenData').value;
    const output = document.getElementById('output');
    
    if (!inputText.trim() || !hiddenData.trim()) {
        showFeedback('Please enter both cover text and hidden message.', 'error');
        output.value = '';
        return;
    }
    
    // Convert hidden data to binary
    const binaryData = hiddenData.split('').map(char => 
        char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join('');
    
    // Split text into parts
    const parts = inputText.split(/(\s+)/);
    let binaryIndex = 0;
    
    // Encode binary data into spaces
    const encodedText = parts.map(part => {
        if (part.trim() === '') {
            if (binaryIndex < binaryData.length) {
                const isDouble = binaryData[binaryIndex] === '1';
                binaryIndex++;
                return isDouble ? '  ' : ' ';
            }
            return ' ';
        }
        return part;
    }).join('');
    
    output.value = encodedText;
    showFeedback('Message encoded successfully!', 'success');
} 