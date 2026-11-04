export const bank = [
  // ========== FÁCILES (100 pts) ==========
  {
    kind: 'matching',
    points: 100,
    payload: {
      prompt: '¿En qué zona crece mejor esta planta?',
      plant: 'Frailejón',
      options: ['Páramo (3000m+)', 'Selva tropical (0-1000m)', 'Desierto (0-500m)', 'Nieve (5000m+)'],
      correct_index: 0
    }
  },
  {
    kind: 'trivia',
    points: 100,
    payload: {
      prompt: '¿Qué pasa con la temperatura a medida que subimos una montaña?',
      options: ['Aumenta', 'Disminuye', 'Se mantiene igual', 'Depende del viento'],
      correct_index: 1
    }
  },
  {
    kind: 'matching',
    points: 100,
    payload: {
      prompt: '¿Dónde crece mejor esta planta?',
      plant: 'Orquídea',
      options: ['Nieve (5000m+)', 'Selva tropical (0-1500m)', 'Páramo (3000m+)', 'Desierto (0-500m)'],
      correct_index: 1
    }
  },
  {
    kind: 'trivia',
    points: 100,
    payload: {
      prompt: '¿Cuál es la montaña más alta del Ecuador?',
      options: ['Cotopaxi', 'Chimborazo', 'Cayambe', 'Antisana'],
      correct_index: 1
    }
  },
  {
    kind: 'matching',
    points: 100,
    payload: {
      prompt: '¿A qué zona pertenece esta planta?',
      plant: 'Cactus',
      options: ['Nieve (5000m+)', 'Páramo (3000m+)', 'Zona seca (0-1000m)', 'Selva tropical (1000m)'],
      correct_index: 2
    }
  },
  {
    kind: 'trivia',
    points: 100,
    payload: {
      prompt: '¿Cómo se llama el naturalista que intentó escalar el Chimborazo en 1802?',
      options: ['Charles Darwin', 'Alexander von Humboldt', 'Isaac Newton', 'Galileo Galilei'],
      correct_index: 1
    }
  },
  {
    kind: 'matching',
    points: 100,
    payload: {
      prompt: '¿Dónde habita esta planta?',
      plant: 'Musgo de turbera',
      options: ['Páramo (3000m+)', 'Desierto (0-500m)', 'Selva tropical (0-1000m)', 'Playa (0m)'],
      correct_index: 0
    }
  },
  {
    kind: 'trivia',
    points: 100,
    payload: {
      prompt: '¿Qué necesita una planta para hacer fotosíntesis?',
      options: ['Luz solar, agua y CO2', 'Solo agua', 'Solo tierra', 'Solo oxígeno'],
      correct_index: 0
    }
  },
  {
    kind: 'matching',
    points: 100,
    payload: {
      prompt: '¿En qué zona vive esta planta?',
      plant: 'Helecho arbóreo',
      options: ['Selva tropical (0-1500m)', 'Páramo (3000m+)', 'Nieve (5000m+)', 'Desierto (0-500m)'],
      correct_index: 0
    }
  },
  {
    kind: 'trivia',
    points: 100,
    payload: {
      prompt: '¿Qué gas respiramos los seres vivos?',
      options: ['Nitrógeno', 'Oxígeno', 'Hidrógeno', 'Helio'],
      correct_index: 1
    }
  },
  {
    kind: 'trivia',
    points: 100,
    payload: {
      prompt: '¿Cuál es la capital de Ecuador?',
      options: ['Guayaquil', 'Quito', 'Cuenca', 'Loja'],
      correct_index: 1
    }
  },
  {
    kind: 'matching',
    points: 100,
    payload: {
      prompt: '¿Dónde crece esta planta?',
      plant: 'Líquen',
      options: ['Rocas de altura (4000m+)', 'Playa (0m)', 'Selva húmeda (500m)', 'Río (0m)'],
      correct_index: 0
    }
  },

  // ========== MEDIO-FÁCILES (150 pts) ==========
  {
    kind: 'trivia',
    points: 150,
    payload: {
      prompt: '¿Cómo se llamaba el compañero botánico de Humboldt en la expedición?',
      options: ['Aimé Bonpland', 'Charles Darwin', 'Carl Sagan', 'Plinio el Viejo'],
      correct_index: 0
    }
  },
  {
    kind: 'matching',
    points: 150,
    payload: {
      prompt: '¿A qué zona corresponde esta planta?',
      plant: 'Chuquiragua (flor del andinista)',
      options: ['Alta montaña (3500-4500m)', 'Selva tropical (0-1000m)', 'Playa (0m)', 'Desierto (0-500m)'],
      correct_index: 0
    }
  },
  {
    kind: 'trivia',
    points: 150,
    payload: {
      prompt: '¿Cómo se llama el mapa ecológico creado por Humboldt?',
      options: ['Naturgemälde', 'Mapamundi', 'Atlas Botánico', 'Topografía'],
      correct_index: 0
    }
  },
  {
    kind: 'trivia',
    points: 150,
    payload: {
      prompt: '¿A qué altitud aproximada empieza el páramo?',
      options: ['1000m', '2000m', '3000m', '4500m'],
      correct_index: 2
    }
  },
  {
    kind: 'matching',
    points: 150,
    payload: {
      prompt: '¿Qué tipo de clima tiene esta planta?',
      plant: 'Pino de altura',
      options: ['Bosque templado (2000-3000m)', 'Desierto (0-500m)', 'Selva tropical (0-1000m)', 'Playa (0m)'],
      correct_index: 0
    }
  },
  {
    kind: 'trivia',
    points: 150,
    payload: {
      prompt: '¿Qué significa "páramo" en términos ecológicos?',
      options: ['Un ecosistema frío de altura', 'Un bosque tropical', 'Una llanura costera', 'Un río de montaña'],
      correct_index: 0
    }
  },
  {
    kind: 'trivia',
    points: 150,
    payload: {
      prompt: '¿Cuánto baja la temperatura aproximadamente por cada 1000m de altura?',
      options: ['1°C', '3°C', '6.5°C', '10°C'],
      correct_index: 2
    }
  },
  {
    kind: 'matching',
    points: 150,
    payload: {
      prompt: '¿En qué piso altitudinal crece esta planta?',
      plant: 'Bromelia',
      options: ['Selva tropical (0-1500m)', 'Nieve (5000m+)', 'Páramo (3000m+)', 'Desierto (0-500m)'],
      correct_index: 0
    }
  },
  {
    kind: 'trivia',
    points: 150,
    payload: {
      prompt: '¿Qué significa que una planta sea "endémica"?',
      options: ['Que es única de una región', 'Que es invasora', 'Que crece en todo el mundo', 'Que está extinta'],
      correct_index: 0
    }
  },
  {
    kind: 'trivia',
    points: 150,
    payload: {
      prompt: '¿Cuál fue una de las contribuciones principales de Humboldt a la ciencia?',
      options: ['Inventó el telescopio', 'Estudió la relación entre clima, altitud y vegetación', 'Descubrió la gravedad', 'Creó la química moderna'],
      correct_index: 1
    }
  },
  {
    kind: 'matching',
    points: 150,
    payload: {
      prompt: '¿A qué zona corresponde esta planta?',
      plant: 'Achupalla (Puya)',
      options: ['Páramo (3000m+)', 'Selva tropical (0-1000m)', 'Desierto (0-500m)', 'Playa (0m)'],
      correct_index: 0
    }
  },
  {
    kind: 'trivia',
    points: 150,
    payload: {
      prompt: '¿Qué es el "soroche" o mal de altura?',
      options: ['Una planta andina', 'Un malestar por falta de oxígeno en altura', 'Un tipo de nube', 'Un río del Chimborazo'],
      correct_index: 1
    }
  },

  // ========== MEDIOS (200 pts) ==========
  {
    kind: 'trivia',
    points: 200,
    payload: {
      prompt: '¿Qué le ocurre al oxígeno a medida que subimos?',
      options: ['Aumenta', 'Se vuelve más denso', 'Disminuye la presión parcial', 'No cambia'],
      correct_index: 2
    }
  },
  {
    kind: 'matching',
    points: 200,
    payload: {
      prompt: '¿Qué tipo de planta es esta?',
      plant: 'Espeletia (frailejón gigante)',
      options: ['Planta de páramo', 'Planta de desierto', 'Planta acuática', 'Planta de playa'],
      correct_index: 0
    }
  },
  {
    kind: 'trivia',
    points: 200,
    payload: {
      prompt: '¿A qué altitud aproximada llegó Humboldt en el Chimborazo?',
      options: ['4000m', '5000m', '5800m', '6000m'],
      correct_index: 2
    }
  },
  {
    kind: 'trivia',
    points: 200,
    payload: {
      prompt: '¿Qué significa "Naturgemälde" en alemán?',
      options: ['Mapa del mundo', 'Pintura de la naturaleza', 'Libro de plantas', 'Estudio del clima'],
      correct_index: 1
    }
  },
  {
    kind: 'trivia',
    points: 200,
    payload: {
      prompt: '¿Qué efecto tiene la altura sobre el cuerpo humano?',
      options: ['Más oxígeno disponible', 'Menos oxígeno disponible', 'Ningún efecto', 'Más presión'],
      correct_index: 1
    }
  },
  {
    kind: 'trivia',
    points: 200,
    payload: {
      prompt: '¿Qué adaptación tienen muchas plantas del páramo para el frío?',
      options: ['Hojas peludas o cerosas', 'Raíces muy largas', 'Flores grandes', 'Tallos huecos'],
      correct_index: 0
    }
  },
  {
    kind: 'trivia',
    points: 200,
    payload: {
      prompt: '¿Qué es la línea de nieve perpetua?',
      options: ['Donde nieva todo el año', 'La zona donde nunca se derrite la nieve', 'El río más frío', 'Una nube permanente'],
      correct_index: 1
    }
  },
  {
    kind: 'trivia',
    points: 200,
    payload: {
      prompt: '¿Por qué se considera el Naturgemälde una de las primeras infografías científicas?',
      options: ['Porque usaba colores brillantes', 'Porque combinaba datos, dibujo y franjas de vegetación por altitud', 'Porque era una fotografía', 'Porque lo hizo un pintor famoso'],
      correct_index: 1
    }
  },

  // ========== DIFÍCILES (250-300 pts) ==========
  {
    kind: 'trivia',
    points: 250,
    payload: {
      prompt: '¿Qué relación descubrió Humboldt entre altitud y vegetación?',
      options: ['Que no había relación', 'Que la vegetación cambia según la altitud y el clima', 'Que todas las plantas crecen en cualquier altura', 'Que solo importa el suelo'],
      correct_index: 1
    }
  },
  {
    kind: 'trivia',
    points: 250,
    payload: {
      prompt: '¿Qué es un "piso altitudinal"?',
      options: ['Un edificio de montaña', 'Una franja de vegetación según la altura', 'Una escalera natural', 'Un tipo de roca'],
      correct_index: 1
    }
  },
  {
    kind: 'trivia',
    points: 250,
    payload: {
      prompt: '¿Qué planta es conocida como "flor del andinista"?',
      options: ['Chuquiragua', 'Orquídea', 'Frailejón', 'Cactus'],
      correct_index: 0
    }
  },
  {
    kind: 'trivia',
    points: 250,
    payload: {
      prompt: '¿Qué impidió que Humboldt llegara a la cima del Chimborazo?',
      options: ['Una tormenta de nieve', 'Una grieta infranqueable en el hielo', 'Falta de agua', 'Un derrumbe'],
      correct_index: 1
    }
  },
  {
    kind: 'trivia',
    points: 300,
    payload: {
      prompt: 'Según Humboldt, ¿qué idea nació al contemplar las franjas de vegetación desde el Chimborazo?',
      options: ['Que la naturaleza es un conjunto de piezas aisladas', 'Que la naturaleza es una red interconectada', 'Que solo importan los animales', 'Que la altura no afecta la vida'],
      correct_index: 1
    }
  },
  {
    kind: 'trivia',
    points: 300,
    payload: {
      prompt: '¿Qué proceso permite a muchas plantas del páramo sobrevivir al frío extremo?',
      options: ['Fotosíntesis acelerada', 'Antocianinas y pubescencia en hojas', 'Raíces superficiales', 'Floración nocturna'],
      correct_index: 1
    }
  }
];

export function getShuffledBank() {
  const shuffled = [...bank];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}