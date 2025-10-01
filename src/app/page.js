// src/app/page.js

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import PokemonSelector from "@/components/PokemonSelector.jsx";
import PokemonEditor from '@/components/PokemonEditor.jsx';
import TeamSidebar from '@/components/TeamSidebar.jsx';
import ExportModal from '@/components/ExportModal.jsx';
import ImportModal from '@/components/ImportModal.jsx';
import AuthModal from '@/components/AuthModal.jsx';
import LoadTeamModal from '@/components/LoadTeamModal.jsx';
import Header from '@/components/layout/Header.jsx';
import Sidebar from '@/components/layout/Sidebar.jsx';
import { exportTeamToString } from '@/utils/teamFormatter.js';
import { parseTeamFromString } from '@/utils/teamParser.js';

function generateShortId(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}

export default function Home() {
  const { session } = useAuth();
  const router = useRouter();
  
  const [team, setTeam] = useState([]);
  const [activeMemberId, setActiveMemberId] = useState(null);
  const [teamName, setTeamName] = useState('Mi Equipo VGC');
  const [currentTeamId, setCurrentTeamId] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [natures, setNatures] = useState([]);
  const [savedTeams, setSavedTeams] = useState([]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportText, setExportText] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  
  useEffect(() => {
    axios.get('https://pokeapi.co/api/v2/nature?limit=25')
      .then(res => {
        const sortedNatures = res.data.results.sort((a, b) => a.name.localeCompare(b.name));
        setNatures(sortedNatures);
      });
  }, []);

  const handleSelectPokemon = (pokemon) => {
    if (team.length >= 6) return;
    if (team.length === 0) {
      setCurrentTeamId(null);
      setTeamName('Mi Equipo VGC');
      setIsPublic(false);
    }
    setLoadingDetails(true);
    axios.get(pokemon.url)
      .then(response => {
        const newTeamMember = {
          id: self.crypto.randomUUID(), details: response.data,
          customization: {
            ability: response.data.abilities.find(a => !a.is_hidden)?.ability.name || response.data.abilities[0]?.ability.name,
            moves: [null, null, null, null], nature: 'adamant', item: null,
            evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
            ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 }, // IVs añadidos
            level: 50,
            shiny: false, gender: 'Random', teraType: response.data.types[0].type.name,
          }
        };
        setTeam([...team, newTeamMember]);
        setActiveMemberId(newTeamMember.id);
      })
      .catch(error => console.error("Error fetching Pokémon details:", error))
      .finally(() => setLoadingDetails(false));
  };
  
  const handleRemovePokemon = (pokemonIdToRemove) => {
    const memberToRemoveIndex = team.findIndex(p => p.id === pokemonIdToRemove);
    const newTeam = team.filter(p => p.id !== pokemonIdToRemove);
    setTeam(newTeam);
    if (activeMemberId === pokemonIdToRemove) {
      if (newTeam.length === 0) setActiveMemberId(null);
      else {
        const newActiveIndex = Math.max(0, memberToRemoveIndex - 1);
        setActiveMemberId(newTeam[newActiveIndex].id);
      }
    }
  };

  const handleUpdateTeamMember = (memberId, newCustomization) => {
    setTeam(currentTeam => 
      currentTeam.map(member => member.id === memberId ? { ...member, customization: newCustomization } : member)
    );
  };
  
  const handleSaveTeam = async () => {
    if (!session) return alert("Por favor, inicia sesión para guardar tu equipo.");
    if (team.length === 0) return alert("No puedes guardar un equipo vacío.");
    const teamToSave = {
      team_name: teamName,
      team_data: team.map(member => ({ name: member.details.name, customization: member.customization })),
      user_id: session.user.id,
      is_public: isPublic
    };
    try {
      let error;
      if (currentTeamId) {
        const { error: updateError } = await supabase.from('teams').update(teamToSave).eq('id', currentTeamId);
        error = updateError;
      } else {
        const { data, error: insertError } = await supabase.from('teams').insert([teamToSave]).select();
        error = insertError;
        if (data) setCurrentTeamId(data[0].id);
      }
      if (error) throw error;
      alert(`¡Equipo ${currentTeamId ? 'actualizado' : 'guardado'} con éxito!`);
    } catch (error) {
      console.error('Error guardando el equipo:', error);
      alert('Hubo un error al guardar el equipo.');
    }
  };

  const fetchSavedTeams = async () => {
    if (!session) return;
    try {
      const { data, error } = await supabase.from('teams').select('*').eq('user_id', session.user.id);
      if (error) throw error;
      setSavedTeams(data);
    } catch (error) {
      console.error("Error cargando equipos:", error);
    }
  };

  const handleLoadClick = async () => {
    await fetchSavedTeams();
    setIsLoadModalOpen(true);
  };

  const handleLoadTeam = async (teamToLoad) => {
    setCurrentTeamId(teamToLoad.id);
    setLoadingDetails(true);
    try {
      const newTeamPromises = teamToLoad.team_data.map(p => axios.get(`https://pokeapi.co/api/v2/pokemon/${p.name}`));
      const responses = await Promise.all(newTeamPromises);
      const newTeam = responses.map((response, index) => {
        const savedPokemonData = teamToLoad.team_data[index];
        const defaultCustomization = {
          ability: response.data.abilities[0]?.ability.name || null,
          moves: [null, null, null, null], nature: 'adamant', item: null,
          evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
          ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
          level: 50, shiny: false, gender: 'Random',
          teraType: response.data.types[0].type.name,
        };
        return {
          id: self.crypto.randomUUID(), details: response.data,
          customization: { ...defaultCustomization, ...savedPokemonData.customization },
        };
      });
      setTeam(newTeam);
      setTeamName(teamToLoad.team_name);
      setIsPublic(teamToLoad.is_public || false);
      setActiveMemberId(newTeam[0]?.id || null);
      setIsLoadModalOpen(false);
    } catch (error) {
      console.error("Error al rehidratar el equipo:", error);
      alert("Hubo un error al cargar los detalles del equipo.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm("¿Estás seguro de que quieres borrar este equipo?")) {
      try {
        const { error } = await supabase.from('teams').delete().eq('id', teamId);
        if (error) throw error;
        setSavedTeams(currentTeams => currentTeams.filter(t => t.id !== teamId));
      } catch (error) {
        console.error("Error borrando el equipo:", error);
      }
    }
  };
  
  const handleShareTeam = async (teamToShare) => {
    if (!session) return alert("Por favor, inicia sesión para compartir.");
    alert("Generando enlace para compartir... esto puede tardar un momento.");
    setLoadingDetails(true);
    try {
      const newTeamPromises = teamToShare.team_data.map(p => axios.get(`https://pokeapi.co/api/v2/pokemon/${p.name}`));
      const responses = await Promise.all(newTeamPromises);
      const fullTeamData = responses.map((response, index) => ({
        id: self.crypto.randomUUID(),
        details: response.data,
        customization: teamToShare.team_data[index].customization,
      }));
      const pasteData = exportTeamToString(fullTeamData);
      const newSheet = {
        title: teamToShare.team_name,
        paste_data: pasteData,
        user_id: session.user.id,
        short_id: generateShortId(),
      };
      const { error: insertError } = await supabase.from('sheets').insert([newSheet]);
      if (insertError) throw insertError;
      const shareUrl = `/sheets/${newSheet.short_id}`;
      router.push(shareUrl);
      setIsLoadModalOpen(false);
    } catch (error) {
      console.error("Error al compartir el equipo:", error);
      alert("Hubo un error al generar el enlace para compartir.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleExportClick = () => {
    const teamText = exportTeamToString(team);
    setExportText(teamText);
    setIsExportModalOpen(true);
  };

  const handleImportTeam = async (teamString) => {
    setCurrentTeamId(null);
    setTeamName('Equipo Importado');
    setIsPublic(false);
    const parsedData = parseTeamFromString(teamString);
    if (parsedData.length === 0 || parsedData.length > 6) return alert("Texto de importación inválido.");
    setLoadingDetails(true);
    try {
      const responses = await Promise.all(parsedData.map(p => axios.get(`https://pokeapi.co/api/v2/pokemon/${p.name}`)));
      const newTeam = responses.map((response, index) => {
        const parsedPokemon = parsedData[index];
        const defaultCustomization = {
          ability: response.data.abilities[0]?.ability.name || null,
          moves: [null, null, null, null], nature: 'adamant', item: null,
          evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
          ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
          level: 50, shiny: false, gender: 'Random',
          teraType: response.data.types[0].type.name,
        };
        return { 
          id: self.crypto.randomUUID(), details: response.data,
          customization: { ...defaultCustomization, ...parsedPokemon } 
        };
      });
      setTeam(newTeam);
      setActiveMemberId(newTeam[0]?.id || null);
    } catch (error) {
      console.error("Error al importar el equipo:", error);
      alert("Error al importar. Revisa los nombres de los Pokémon.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleAuth = async (email, password, isSigningUp) => {
    const { error } = isSigningUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setIsAuthModalOpen(false);
    alert(isSigningUp ? '¡Cuenta creada! Revisa tu email para confirmar.' : '¡Has iniciado sesión!');
  };

  const activeMember = team.find(member => member.id === activeMemberId);

  return (
    <>
      <div className="flex h-screen bg-slate-900 text-white flex-col">
        <Header 
          onAuthClick={() => setIsAuthModalOpen(true)}
        />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <div className='flex-1 flex p-6 gap-6'>
            <TeamSidebar
              team={team}
              activeMemberId={activeMemberId}
              onTabClick={setActiveMemberId}
              teamName={teamName}
              onTeamNameChange={setTeamName}
              onSaveTeam={handleSaveTeam}
              isTeamEmpty={team.length === 0}
              pokemonSelectorComponent={<PokemonSelector onPokemonSelect={handleSelectPokemon} />}
              isPublic={isPublic}
              onIsPublicChange={setIsPublic}
              onLoadClick={handleLoadClick}
              onImportClick={() => setIsImportModalOpen(true)}
              onExportClick={handleExportClick}
            />
            <main className="flex-1 overflow-y-auto">
              {loadingDetails && <div className="flex items-center justify-center h-full"><p>Cargando detalles...</p></div>}
              
              {!loadingDetails && activeMember && (
                <PokemonEditor 
                  team={team}
                  member={activeMember}
                  onRemove={handleRemovePokemon}
                  onUpdate={handleUpdateTeamMember}
                  natures={natures}
                />
              )}

              {!loadingDetails && !activeMember && (
                <div className="flex items-center justify-center h-full bg-slate-800/50 rounded-lg">
                  <p className="text-slate-400">Selecciona un Pokémon o carga un equipo para empezar.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuth={handleAuth} />
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} textToExport={exportText} />
      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImport={handleImportTeam} />
      <LoadTeamModal 
        isOpen={isLoadModalOpen} 
        onClose={() => setIsLoadModalOpen(false)} 
        savedTeams={savedTeams} 
        onLoad={handleLoadTeam} 
        onDelete={handleDeleteTeam}
        onShare={handleShareTeam}
      />
    </>
  );
}