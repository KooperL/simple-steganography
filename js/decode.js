// JavaScript functions specific to the decode page

function loadSampleText() {
    document.getElementById('inputText').value = "The  quick brown  fox  jumps  over  the  lazy  dog";
    updatePreviews();
}

function updatePreviews() {
    const encodedText = document.getElementById('inputText').value;
    const spacePreview = document.getElementById('spacePreview');
    const binaryPreview = document.getElementById('binaryPreview');
    const detectedSpaces = document.getElementById('detectedSpaces');
    const singleSpaces = document.getElementById('singleSpaces');
    const doubleSpaces = document.getElementById('doubleSpaces');
    
    if (encodedText.trim()) {
        // Split text into parts and analyze spaces
        const parts = encodedText.split(/(\s+)/);
        const spaces = parts.filter(part => part.trim() === '');
        
        // Update space preview
        const preview = parts.map(part => {
            if (part.trim() === '') {
                const isDouble = part.length > 1;
                return `<span class="space-preview${isDouble ? ' double' : ''} highlight"></span>`;
            }
            return part;
        }).join('');
        spacePreview.innerHTML = preview;
        
        // Update stats
        detectedSpaces.textContent = spaces.length;
        singleSpaces.textContent = spaces.filter(space => space.length === 1).length;
        doubleSpaces.textContent = spaces.filter(space => space.length > 1).length;
        
        // Update binary preview
        const binaryString = spaces.map(space => space.length === 1 ? '0' : '1').join(' ');
        binaryPreview.textContent = binaryString;
    } else {
        spacePreview.innerHTML = '';
        binaryPreview.textContent = '';
        detectedSpaces.textContent = '0';
        singleSpaces.textContent = '0';
        doubleSpaces.textContent = '0';
    }
}

function decodeBinary() {
    const encodedText = document.getElementById('inputText').value;
    const output = document.getElementById('output');
    
    if (!encodedText.trim()) {
        showFeedback('Please enter some encoded text.', 'error');
        output.value = '';
        return;
    }

    try {
        // Split text into parts and extract spaces
        const parts = encodedText.split(/(\s+)/);
        const spaces = parts.filter(part => part.trim() === '');
        
        // Convert spaces to binary
        const binaryString = spaces.map(space => space.length === 1 ? '0' : '1').join('');
        
        // Convert binary to text
        let decodedText = '';
        for (let i = 0; i < binaryString.length; i += 8) {
            const byte = binaryString.slice(i, i + 8);
            if (byte.length === 8) {
                decodedText += String.fromCharCode(parseInt(byte, 2));
            }
        }
        
        output.value = decodedText;
        showFeedback('Message decoded successfully!', 'success');
    } catch (error) {
        output.value = '';
        showFeedback('Error decoding message. Please check the encoded text.', 'error');
    }
} 