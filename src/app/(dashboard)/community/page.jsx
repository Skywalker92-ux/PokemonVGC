
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

const CommunityTeamCard = ({ team }) => {
  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
      <h3 className="text-xl font-bold truncate mb-3">{team.team_name}</h3>
      <div className="grid grid-cols-6 gap-2 mb-4">
        {team.team_data.map((member, index) => (
          <div key={index} className="bg-slate-700 p-1 rounded-md">
            <p className="text-xs capitalize text-center truncate">{member.name}</p>
          </div>
        ))}
      </div>
      <button 
        className="w-full px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-md text-sm font-semibold"
      >
        Importar
      </button>
    </div>
  );
};


export default async function CommunityPage() {
  const { data: publicTeams, error } = await supabase
    .from('teams')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching public teams:", error);
    return <p className="text-center text-red-500">No se pudieron cargar los equipos.</p>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Equipos de la Comunidad</h1>
        <p className="text-slate-400 mt-2">Explora, importa y aprende de las estrategias compartidas por otros jugadores.</p>
      </div>
      
      {publicTeams.length === 0 ? (
        <p className="text-center text-slate-400">Aún no hay equipos públicos. ¡Sé el primero en compartir uno!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicTeams.map(team => (
            <CommunityTeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}