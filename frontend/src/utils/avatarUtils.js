// Generate a random color in a pleasing palette
const generateRandomColor = () => {
  const colors = [
    '#2196F3', // Blue
    '#4CAF50', // Green
    '#FF9800', // Orange
    '#9C27B0', // Purple
    '#E91E63', // Pink
    '#00BCD4', // Cyan
    '#FFC107', // Amber
    '#795548', // Brown
    '#607D8B', // Blue Grey
    '#3F51B5', // Indigo
    '#2E7D32', // Green Dark
    '#1976D2', // Blue Dark
    '#7B1FA2', // Purple Dark
    '#C2185B', // Pink Dark
    '#0097A7', // Cyan Dark
    '#FFA000', // Amber Dark
    '#5D4037', // Brown Dark
    '#455A64', // Blue Grey Dark
    '#303F9F', // Indigo Dark
    '#1A237E'  // Indigo Darker
  ];
  // Use Math.random() to ensure we get a different color each time
  const randomIndex = Math.floor(Math.random() * colors.length);
  console.log('Selected color:', colors[randomIndex], 'at index:', randomIndex);
  return colors[randomIndex];
};

// Generate initials from name (first letter of first and last word, always uppercase)
const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    // Se só tem um nome, pega as duas primeiras letras
    return parts[0].substring(0, 2).toUpperCase();
  }
  // Pega a primeira letra do primeiro nome e do último nome
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Generate SVG avatar with initials (as base64 data URI)
const generateAvatarSvg = (name, size = 120) => {
  const initials = getInitials(name);
  const backgroundColor = generateRandomColor();
  console.log('Generating avatar for:', name);
  console.log('Initials:', initials);
  console.log('Background color:', backgroundColor);
  
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${backgroundColor}" rx="${size/2}"/>
      <text
        x="50%"
        y="50%"
        dy="0.35em"
        text-anchor="middle"
        fill="white"
        font-family="Arial, sans-serif"
        font-size="${size * 0.4}px"
        font-weight="bold"
      >
        ${initials}
      </text>
    </svg>
  `;
  
  // Encode SVG as base64
  const base64 = window.btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64}`;
};

export { generateAvatarSvg, getInitials, generateRandomColor }; 