import { supabase } from '@/lib/supabaseClient';
import SheetDisplayClient from './SheetDisplayClient.jsx';
import { parseTeamFromString } from '@/utils/teamParser.js';
import axios from 'axios';

export default async function SheetDisplayPage({ params }) {
  const { short_id } = params;

  const { data: sheet, error } = await supabase
    .from('sheets')
    .select('*')
    .eq('short_id', short_id)
    .single();

  if (error || !sheet) {
    const errorMessage = 'No se pudo encontrar el Team Sheet. El enlace puede ser incorrecto o haber sido eliminado.';
    return <SheetDisplayClient sheet={null} error={errorMessage} teamWithDetails={[]} />;
  }

  const parsedTeam = parseTeamFromString(sheet.paste_data);

  let teamWithDetails = [];
  try {
    const detailPromises = parsedTeam.map(p => axios.get(`https://pokeapi.co/api/v2/pokemon/${p.name}`));
    const responses = await Promise.all(detailPromises);
    
    teamWithDetails = responses.map((res, index) => ({
      details: res.data,
      customization: parsedTeam[index]
    }));
  } catch (apiError) {
    console.error("Error fetching details from PokeAPI for a sheet", apiError);
  }

  return <SheetDisplayClient sheet={sheet} teamWithDetails={teamWithDetails} />;
}