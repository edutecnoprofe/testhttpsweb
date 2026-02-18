/**
 * Utilidad para parsear y extraer contenido de los documentos de días
 */

/**
 * Procesa el contenido markdown de un día para extraer información estructurada
 * @param {string} markdownContent - Contenido del archivo .md
 * @returns {Object} Información procesada del día
 */
export const parseDayContent = (markdownContent) => {
  const lines = markdownContent.split('\n');
  const sections = [];
  let currentSection = null;
  let currentContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detectar encabezados de sección (## o ###)
    if (line.startsWith('## ') || line.startsWith('### ')) {
      if (currentSection) {
        sections.push({
          title: currentSection.title,
          level: currentSection.level,
          content: processContent(currentContent.join('\n'))
        });
      }

      currentSection = {
        title: line.replace(/^#+\s*/, '').trim(),
        level: line.startsWith('## ') ? 2 : 3
      };
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }

  // Agregar la última sección
  if (currentSection) {
    sections.push({
      title: currentSection.title,
      level: currentSection.level,
      content: processContent(currentContent.join('\n'))
    });
  }

  // Extraer título principal (primera línea que empieza con #)
  const mainTitleLine = lines.find(line => line.startsWith('# '));
  const mainTitle = mainTitleLine ? mainTitleLine.replace(/^#\s*/, '').trim() : '';

  // Extraer subtítulo (primera línea en negrita después del título)
  let subtitle = '';
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    if (lines[i].includes('**') && !lines[i].startsWith('#')) {
      subtitle = lines[i].replace(/\*\*/g, '').trim();
      break;
    }
  }

  // Encontrar secciones clave
  const keySections = sections.filter(section =>
    section.title.toLowerCase().includes('comida') ||
    section.title.toLowerCase().includes('almuerzo') ||
    section.title.toLowerCase().includes('cena') ||
    section.title.toLowerCase().includes('desayuno') ||
    section.title.toLowerCase().includes('merienda') ||
    section.title.toLowerCase().includes('transport') ||
    section.title.toLowerCase().includes('visita') ||
    section.title.toLowerCase().includes('paseo') ||
    section.title.toLowerCase().includes('regreso') ||
    section.title.toLowerCase().includes('souvenir') ||
    section.title.toLowerCase().includes('curiosidad')
  );

  // Generar resumen mejorado
  const improvedSummary = generateImprovedSummary(mainTitle, subtitle, sections);

  return {
    mainTitle,
    subtitle,
    sections,
    keySections,
    improvedSummary
  };
};

/**
 * Procesa el contenido de una sección para mejorar redacción y eliminar redundancias
 * @param {string} content - Contenido de la sección
 * @returns {string} Contenido procesado
 */
const processContent = (content) => {
  if (!content.trim()) return '';

  let processed = content.trim();

  // Eliminar líneas que son solo guiones o separadores
  processed = processed.replace(/^---+$/gm, '');

  // ── Limpiar sintaxis markdown ──────────────────────────────────
  // Negritas y cursivas: **texto** → texto, *texto* → texto, _texto_ → texto
  processed = processed.replace(/\*\*(.+?)\*\*/g, '$1');
  processed = processed.replace(/\*(.+?)\*/g, '$1');
  processed = processed.replace(/_(.+?)_/g, '$1');

  // Viñetas de lista: líneas que empiezan con "- " o "* " o "• "
  processed = processed.replace(/^[\-\*•]\s+/gm, '');

  // Listas numeradas: "1. " → ""
  processed = processed.replace(/^\d+\.\s+/gm, '');

  // Encabezados residuales (### dentro de sección)
  processed = processed.replace(/^#{1,6}\s+/gm, '');

  // Código inline: `texto` → texto
  processed = processed.replace(/`(.+?)`/g, '$1');

  // Links markdown: [texto](url) → texto
  processed = processed.replace(/\[(.+?)\]\(.+?\)/g, '$1');

  // Múltiples espacios
  processed = processed.replace(/[ \t]{2,}/g, ' ');
  // ──────────────────────────────────────────────────────────────

  // Unir líneas en párrafos (línea vacía = separador de párrafo)
  const lines = processed.split('\n');
  const paragraphs = [];
  let currentParagraph = [];

  for (const line of lines) {
    if (line.trim() === '') {
      if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph.join(' '));
        currentParagraph = [];
      }
    } else {
      currentParagraph.push(line.trim());
    }
  }

  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph.join(' '));
  }

  // Mejorar redacción de cada párrafo
  const improvedParagraphs = paragraphs
    .map(p => improveText(p))
    .filter(p => p.trim().length > 0);

  return improvedParagraphs.join('\n\n');
};


/**
 * Genera un resumen mejorado basado en el contenido del día
 * @param {string} mainTitle - Título principal
 * @param {string} subtitle - Subtítulo
 * @param {Array} sections - Secciones procesadas
 * @returns {string} Resumen mejorado
 */
const generateImprovedSummary = (mainTitle, subtitle, sections) => {
  const keywords = [];

  // Extraer palabras clave de las secciones
  sections.forEach(section => {
    const titleLower = section.title.toLowerCase();

    if (titleLower.includes('comida') || titleLower.includes('almuerzo') || titleLower.includes('cena')) {
      if (!keywords.includes('Gastronomía')) keywords.push('Gastronomía');
    }
    if (titleLower.includes('transport')) {
      if (!keywords.includes('Transporte')) keywords.push('Transporte');
    }
    if (titleLower.includes('visita')) {
      if (!keywords.includes('Monumentos')) keywords.push('Monumentos');
    }
    if (titleLower.includes('paseo')) {
      if (!keywords.includes('Paseos')) keywords.push('Paseos');
    }
    if (titleLower.includes('curiosidad')) {
      if (!keywords.includes('Curiosidades')) keywords.push('Curiosidades');
    }
    if (titleLower.includes('souvenir')) {
      if (!keywords.includes('Compras')) keywords.push('Compras');
    }
  });

  // Crear resumen basado en las palabras clave
  if (keywords.length > 0) {
    const lastKeyword = keywords.pop();
    const keywordList = keywords.length > 0 ?
      `${keywords.join(', ')} y ${lastKeyword}` :
      lastKeyword;

    return `Incluye ${keywordList.toLowerCase()}.`;
  }

  // Si no hay palabras clave específicas, usar el subtítulo
  if (subtitle) {
    return subtitle;
  }

  return '';
};

/**
 * Mejora la redacción de un texto eliminando redundancias y mejorando la claridad
 * @param {string} text - Texto a mejorar
 * @returns {string} Texto mejorado
 */
const improveText = (text) => {
  let improved = text;

  // Patrones comunes de redundancia a eliminar
  const redundancyPatterns = [
    // Eliminar frases redundantes
    [/justo\s+ahí\s+en\s+el\s+mismo\s+lugar/gi, 'ahí'],
    [/muy\s+cerca\s+de\s+la\s+zona/gi, 'cerca'],
    [/perfecto\s+para\s+que\s+los\s+niños/gi, 'ideal para niños'],
    [/es\s+uno\s+de\s+los\s+más\s+famosos\s+de\s+roma/gi, 'es famoso en Roma'],
    [/podéis\s+ver\s+y\s+disfrutar\s+de/gi, 'podéis ver'],
    [/es\s+una\s+de\s+las\s+mejores\s+opciones\s+para/gi, 'es ideal para'],
    [/no\s+te\s+pierdas\s+la\s+oportunidad\s+de/gi, 'recomendamos'],
    [/es\s+imprescindible\s+visitar/gi, 'es esencial visitar'],
    // Simplificar expresiones
    [/a\s+continuación\s+te\s+explicamos/gi, ''],
    [/como\s+ya\s+hemos\s+mencionado\s+anteriormente/gi, ''],
    [/por\s+supuesto\s+que\s+sí/gi, 'sí'],
    [/sin\s+lugar\s+a\s+dudas/gi, ''],
    [/desde\s+luego\s+que/gi, ''],
  ];

  redundancyPatterns.forEach(([pattern, replacement]) => {
    improved = improved.replace(pattern, replacement);
  });

  // Eliminar espacios múltiples
  improved = improved.replace(/\s+/g, ' ').trim();

  // Capitalizar primera letra
  improved = improved.charAt(0).toUpperCase() + improved.slice(1);

  return improved;
};

/**
 * Obtiene el nombre del archivo de documento para un día
 * @param {string} dayId - ID del día (ej: 'day1', 'day2')
 * @returns {string} Nombre del archivo .md
 */
export const getDayDocumentName = (dayId) => {
  const dayMap = {
    'day1': 'SABADO',
    'day2': 'DOMINGO',
    'day3': 'LUNES',
    'day4': 'MARTES',
    'day5': 'MIERCOLES',
    'day6': 'JUEVES',
    'day7': 'VIERNES'
  };

  return dayMap[dayId] || '';
};

/**
 * Carga el contenido del documento de un día desde el sistema de archivos
 * @param {string} dayId - ID del día (ej: 'day1', 'day2')
 * @returns {Promise<Object>} Promesa con la información parseada del día
 */
export const loadDayContent = async (dayId) => {
  const fileName = getDayDocumentName(dayId);
  if (!fileName) {
    return {
      mainTitle: '',
      subtitle: '',
      sections: [],
      keySections: [],
      improvedSummary: ''
    };
  }

  try {
    // En un entorno real, esto haría fetch del archivo
    // Por ahora simulamos que obtenemos el contenido
    const response = await fetch(`/docs/${fileName}.md`);
    if (!response.ok) {
      throw new Error(`No se pudo cargar el documento: ${fileName}.md`);
    }

    const markdownContent = await response.text();
    return parseDayContent(markdownContent);
  } catch (error) {
    console.error(`Error cargando contenido para ${dayId}:`, error);
    return {
      mainTitle: '',
      subtitle: '',
      sections: [],
      keySections: [],
      improvedSummary: ''
    };
  }
};