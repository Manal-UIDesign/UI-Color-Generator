// Example categories and colors for simplicity
const categories = {
    sustainability: ['#73A580', '#A0CCAB', '#A4BE97', '#3C5743', '#ADD98B'],
    finance: ['#00416A', '#5D737E', '#A1C3D1', '#92A8D1', '#034748'],
    technology: ['#1B263B', '#415A77', '#778DA9', '#E0E1DD', '#F4F4F9'],
    healthcare: ['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1'],
    education: ['#FFB400', '#FF6B6B', '#4ECDC4', '#556270', '#C7F464'],
    entertainment: ['#F67280', '#C06C84', '#6C5B7B', '#355C7D', '#F8B195'],
    fashion: ['#D79922', '#EFE2BA', '#F13C20', '#4056A1', '#283655'],
    automotive: ['#1F2833', '#C5C6C7', '#66FCF1', '#45A29E', '#0B0C10'],
    travel: ['#FFA69E', '#FF686B', '#FF8C94', '#FFAAA6', '#FFD3B5'],
    realestate: ['#0E2431', '#FC3A52', '#F5E663', '#F8AFA6', '#CED3DC'],
    ecommerce: ['#1A1A1D', '#4E4E50', '#6F2232', '#950740', '#C3073F'],
    gaming: ['#1E1F26', '#283655', '#4D648D', '#D0E1F9', '#6B7A8F'],
    food: ['#3A3A3A', '#5A5A5A', '#C94C4C', '#F2AE72', '#8C4646'],
    sports: ['#36454F', '#2F4F4F', '#556B2F', '#808000', '#BDB76B'],
    wellness: ['#AA4465', '#861657', '#D90368', '#E7DADA', '#2E294E'],
};

function blendColors(color1, color2, percentage) {
    // Simple color blending function for demonstration
    const f = parseInt(color1.slice(1), 16);
    const t = parseInt(color2.slice(1), 16);
    const R1 = f >> 16;
    const G1 = (f >> 8) & 0x00FF;
    const B1 = f & 0x0000FF;
    const R2 = t >> 16;
    const G2 = (t >> 8) & 0x00FF;
    const B2 = t & 0x0000FF;
    const R = Math.round(R2 + (R1 - R2) * percentage);
    const G = Math.round(G2 + (G1 - G2) * percentage);
    const B = Math.round(B2 + (B1 - B2) * percentage);
    return `#${(R << 16 | G << 8 | B).toString(16).padStart(6, '0')}`;
}

function adjustColor(color, percentage) {
    // Adjust the color's hue, saturation, or lightness by the given percentage
    const f = parseInt(color.slice(1), 16);
    let R = f >> 16;
    let G = (f >> 8) & 0x00FF;
    let B = f & 0x0000FF;

    // Convert to HSL
    const hsl = rgbToHsl(R, G, B);

    // Adjust the lightness or saturation to create diversity
    hsl[1] = hsl[1] * (1 + percentage); // Adjust saturation
    hsl[2] = hsl[2] * (1 + percentage); // Adjust lightness

    // Convert back to RGB
    const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);

    // Return the adjusted color
    return `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)}`;
}

function generateColors() {
    const selectedCategory = document.getElementById('category').value;
    const colorInput = document.getElementById('colorPicker').value;
    const colorPalettesContainer = document.getElementById('colorPalettes');
    
    // Clear previous content
    colorPalettesContainer.innerHTML = '';

    // Add updated category subheader with underline and light text for category name
    const subheader = document.createElement('h2');
    subheader.id = 'category-subheader';
    subheader.innerHTML = `Project Category Palette: <span style="text-decoration: underline; font-weight: 300;">${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</span>`;
    colorPalettesContainer.appendChild(subheader);

    for (let i = 0; i < 3; i++) { // Generate 3 different palette groups
        const colors = categories[selectedCategory].map(color => {
            let newColor = blendColors(color, colorInput, Math.random());

            // Further adjust the color to create more variation
            newColor = adjustColor(newColor, (Math.random() - 0.5) * 0.3); // Randomly adjust by ±15%

            return newColor;
        });

        const paletteGroup = document.createElement('div');
        paletteGroup.classList.add('palette-group');
        colors.forEach(color => {
            const palette = document.createElement('div');
            palette.classList.add('palette');
            palette.style.backgroundColor = color;
            palette.textContent = color;
            paletteGroup.appendChild(palette);
        });
        colorPalettesContainer.appendChild(paletteGroup);
    }

    // Call the updateTextColor function after the palettes are generated
    updateTextColor();
}

function updateTextColor() {
    const palettes = document.querySelectorAll('.palette');
    palettes.forEach(palette => {
        const bgColor = window.getComputedStyle(palette).backgroundColor;
        const rgb = bgColor.match(/\d+/g);
        const brightness = Math.round(((parseInt(rgb[0]) * 299) +
                                       (parseInt(rgb[1]) * 587) +
                                       (parseInt(rgb[2]) * 114)) / 1000);

        if (brightness > 180) { // Light color threshold
            palette.style.color = 'black';
        } else {
            palette.style.color = 'white';
        }
    });
}

// Helper functions to convert RGB to HSL and back
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

function hslToRgb(h, s, l) {
    let r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Update color code display when color is selected
document.getElementById('colorPicker').addEventListener('input', function() {
    document.getElementById('colorCode').value = this.value.toUpperCase();
});

// Add event listener to the Generate button
document.getElementById('generateBtn').addEventListener('click', generateColors);
