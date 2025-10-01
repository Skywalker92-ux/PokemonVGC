'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ShareModal from '@/components/ShareModal.jsx';
import TeamSheetDisplay from '@/components/TeamSheetDisplay.jsx';
import TeamImageGenerator from '@/components/TeamImageGenerator.jsx';

export default function SheetDisplayClient({ sheet, error, teamWithDetails }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('created')) {
      setShareUrl(window.location.href.split('?')[0]);
      setIsModalOpen(true);
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center p-4">
        <p className="text-xl text-red-500">{error}</p>
        <Link href="/sheets/create" className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-md font-semibold">
          Crear un Nuevo Sheet
        </Link>
      </div>
    );
  }

  if (!sheet) {
     return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Cargando...</p>
      </div>
    );
  }

  return (
    <>
      <ShareModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        shareUrl={shareUrl}
      />
      <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">{sheet.title}</h1>
            <p className="text-sm text-slate-400 mb-6">
            Creado el: {new Date(sheet.created_at).toLocaleDateString()}
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:pr-4">
            <TeamSheetDisplay team={teamWithDetails} pasteData={sheet.paste_data} />
          </div>
          <div className="lg:pl-4">
            <TeamImageGenerator team={teamWithDetails} teamName={sheet.title} />
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="px-6 py-3 bg-sky-600 hover:bg-sky-500 rounded-md font-semibold">
            Volver al Teambuilder
          </Link>
        </div>
      </div>
    </>
  );
}