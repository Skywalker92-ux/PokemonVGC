'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';

function titleCase(str) {
  if (!str) return '';
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const TEMPLATES = {
  trainer: {
    name: 'Trainer Card',
    src: '/pokemon-trainer-card-boy.png',
    width: 1000,
    height: 563,
  },
  stadium: {
    name: 'Stadium',
    src: '/pokemon-trainer-card-girl.png',
    width: 1000,
    height: 563,
  }
};

const POKEMON_SPRITE_SIZE_IN_SLOT = 100;
const TEAM_NAME_SLOT = { x: 260, y: 20, width: 480, height: 50 };
const POKEMON_SLOTS = [
  { x: 50, y: 160, width: 130, height: 130 },
  { x: 270, y: 160, width: 130, height: 130 },
  { x: 500, y: 160, width: 130, height: 130 },
  { x: 55, y: 330, width: 130, height: 130 },
  { x: 270, y: 330, width: 130, height: 130 },
  { x: 490, y: 330, width: 130, height: 130 },
];

export default function TeamImageGenerator({ team, teamName }) {
  const canvasRef = useRef(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('trainer');

  const drawImage = useCallback(async () => {
    if (!team || team.length === 0) {
      setError("No hay equipo para mostrar.");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError('');
    const canvas = canvasRef.current;
    if (!canvas) return;

    const currentTemplate = TEMPLATES[selectedTemplate];
    const ctx = canvas.getContext('2d');
    canvas.width = currentTemplate.width;
    canvas.height = currentTemplate.height;

    try {
      const templateImage = new Image();
      templateImage.crossOrigin = "anonymous";
      templateImage.src = currentTemplate.src;
      await new Promise((resolve, reject) => {
        templateImage.onload = resolve;
        templateImage.onerror = () => reject(new Error(`No se pudo cargar la plantilla: ${currentTemplate.src}`));
      });
      ctx.drawImage(templateImage, 0, 0, currentTemplate.width, currentTemplate.height);

      ctx.fillStyle = '#333333';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(teamName || "Mi Equipo Pokémon", TEAM_NAME_SLOT.x + TEAM_NAME_SLOT.width / 2, TEAM_NAME_SLOT.y + TEAM_NAME_SLOT.height / 2);

      const spritePromises = team.map(member => {
        return new Promise(resolve => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          const spriteSrc = member.customization.shiny 
            ? member.details.sprites.front_shiny 
            : member.details.sprites.front_default;

          img.src = `/api/image-proxy?url=${encodeURIComponent(spriteSrc)}`;
          img.onload = () => resolve({ img, member });
          img.onerror = () => { img.src = '/pokeball.png'; img.onload = () => resolve({ img, member }); };
        });
      });

      const loadedSprites = await Promise.all(spritePromises);

      loadedSprites.forEach(({ img, member }, index) => {
        const slot = POKEMON_SLOTS[index];
        if (img && slot) {
          const spriteX = slot.x + (slot.width - POKEMON_SPRITE_SIZE_IN_SLOT) / 2;
          const spriteY = slot.y + (slot.height - POKEMON_SPRITE_SIZE_IN_SLOT) / 2;
          ctx.drawImage(img, spriteX, spriteY, POKEMON_SPRITE_SIZE_IN_SLOT, POKEMON_SPRITE_SIZE_IN_SLOT);
          
          ctx.font = 'bold 16px Arial';
          ctx.fillStyle = 'white';
          ctx.textAlign = 'center';
          const textX = slot.x + slot.width / 2;
          const textY = slot.y + slot.height - 5;
          ctx.fillText(titleCase(member.details.name), textX, textY);
        }
      });

      setDownloadUrl(canvas.toDataURL('image/png'));
    } catch (err) {
      console.error("Error al dibujar la imagen:", err);
      setError(err.message || "No se pudo generar la imagen.");
    } finally {
      setIsLoading(false);
    }
  }, [team, teamName, selectedTemplate]); 
  useEffect(() => {
    drawImage();
  }, [drawImage]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-800/50 rounded-lg h-full min-h-[500px]">
      <h3 className="text-xl font-bold mb-4">Vista Previa de la Imagen</h3>
      {isLoading && <p>Generando imagen...</p>}
      {error && <p className="text-red-500 p-4 bg-red-900/50 rounded-md">{error}</p>}
      <canvas ref={canvasRef} className={`rounded-md border border-slate-700 shadow-lg w-full max-w-lg ${isLoading || error ? 'hidden' : 'block'}`} />
      
      {!isLoading && !error && (
        <div className="mt-4 w-full max-w-lg flex flex-col items-center gap-4">
         
          <div className="w-full">
            <label htmlFor="template-select" className="text-sm font-semibold text-slate-400 block mb-1">
              Seleccionar Plantilla
            </label>
            <select
              id="template-select"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 capitalize"
            >
              {Object.entries(TEMPLATES).map(([key, { name }]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>
          
          {downloadUrl && (
            <a 
              href={downloadUrl} 
              download={`${(teamName || 'equipo').replace(/ /g, '_')}.png`}
              className="w-full px-6 py-2 bg-sky-600 hover:bg-sky-500 rounded-md font-semibold text-center transition-colors"
            >
              Descargar Imagen
            </a>
          )}
        </div>
      )}
    </div>
  );
}