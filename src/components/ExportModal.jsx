import React, { useState, useRef } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { 
  getTopGamesByHours, 
  getTopGamesByRating, 
  getTopGamesByYear,
  getAvailableYears,
  generateRankingHTML 
} from '../utils/exportUtils';

const ExportModal = ({ games, onClose }) => {
  const [exportType, setExportType] = useState('hours');
  const [selectedYear, setSelectedYear] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [includeImages, setIncludeImages] = useState(true);
  const previewRef = useRef(null);

  const availableYears = getAvailableYears(games);

  const getGamesForExport = () => {
    switch(exportType) {
      case 'hours':
        return getTopGamesByHours(games, 10);
      case 'rating':
        return getTopGamesByRating(games, 10);
      case 'year':
        return selectedYear ? getTopGamesByYear(games, selectedYear, 10) : [];
      default:
        return [];
    }
  };

  const getTitle = () => {
    switch(exportType) {
      case 'hours':
        return 'MEU TOP 10 - MAIS JOGADOS';
      case 'rating':
        return 'MEU TOP 10 - MELHOR AVALIADOS';
      case 'year':
        return `MEU TOP 10 - ${selectedYear || 'ANO'}`;
      default:
        return 'MEU TOP 10';
    }
  };

  const handleExport = async () => {
    if (!previewRef.current) return;

    setIsExporting(true);
    try {
      const dataUrl = await toPng(previewRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#1e1b4b',
        cacheBust: true,
        skipFonts: true,
        filter: (node) => {
          // Ignorar elementos que podem causar problemas
          return !node.classList?.contains('ignore-export');
        }
      });

      const link = document.createElement('a');
      link.download = `ja-joguei-top10-${exportType}${selectedYear ? '-' + selectedYear : ''}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Erro ao exportar:', error);
      
      // Tentar novamente sem imagens externas
      try {
        console.log('Tentando exportar sem carregar imagens externas...');
        const dataUrl = await toPng(previewRef.current, {
          quality: 0.95,
          pixelRatio: 2,
          backgroundColor: '#1e1b4b',
          cacheBust: false,
          skipFonts: true,
          fetchRequestInit: {
            mode: 'no-cors',
          }
        });

        const link = document.createElement('a');
        link.download = `ja-joguei-top10-${exportType}${selectedYear ? '-' + selectedYear : ''}.png`;
        link.href = dataUrl;
        link.click();
      } catch (retryError) {
        console.error('Erro na segunda tentativa:', retryError);
        alert('Erro ao exportar imagem. As imagens dos jogos podem estar bloqueadas por CORS. Tente usar jogos com imagens hospedadas localmente.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const gamesToExport = getGamesForExport();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">📊 Exportar Ranking</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .preview-container {
              transform: scale(0.35) !important;
            }
          }
          @media (min-width: 769px) and (max-width: 1024px) {
            .preview-container {
              transform: scale(0.6) !important;
            }
          }
          @media (min-width: 1025px) {
            .preview-container {
              transform: scale(0.8) !important;
            }
          }
        `}</style>

        {/* Opções de Exportação */}
        <div className="mb-6">
          <label className="block text-white mb-3 font-semibold">Escolha o tipo de ranking:</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setExportType('hours')}
              className={`p-4 rounded-lg border-2 transition ${
                exportType === 'hours'
                  ? 'border-purple-500 bg-purple-600 bg-opacity-20'
                  : 'border-gray-700 bg-gray-700 hover:border-purple-500'
              }`}
            >
              <div className="text-2xl mb-2">⏱️</div>
              <div className="text-white font-bold">Mais Jogados</div>
              <div className="text-gray-400 text-sm">Por horas jogadas</div>
            </button>

            <button
              onClick={() => setExportType('rating')}
              className={`p-4 rounded-lg border-2 transition ${
                exportType === 'rating'
                  ? 'border-purple-500 bg-purple-600 bg-opacity-20'
                  : 'border-gray-700 bg-gray-700 hover:border-purple-500'
              }`}
            >
              <div className="text-2xl mb-2">⭐</div>
              <div className="text-white font-bold">Melhor Avaliados</div>
              <div className="text-gray-400 text-sm">Por nota</div>
            </button>

            <button
              onClick={() => setExportType('year')}
              className={`p-4 rounded-lg border-2 transition ${
                exportType === 'year'
                  ? 'border-purple-500 bg-purple-600 bg-opacity-20'
                  : 'border-gray-700 bg-gray-700 hover:border-purple-500'
              }`}
            >
              <div className="text-2xl mb-2">📅</div>
              <div className="text-white font-bold">Por Ano</div>
              <div className="text-gray-400 text-sm">Escolha o ano</div>
            </button>
          </div>
        </div>

        {/* Seletor de Ano */}
        {exportType === 'year' && (
          <div className="mb-6">
            <label className="block text-white mb-2 font-semibold">Selecione o ano:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">Escolha um ano</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        )}

        {/* Preview */}
        {gamesToExport.length > 0 ? (
          <>
            <div className="mb-4">
              <h3 className="text-white font-semibold mb-2">Preview:</h3>
              <div className="bg-gray-900 p-4 rounded-lg overflow-auto flex justify-center">
                <div 
                  ref={previewRef}
                  className="preview-container"
                  style={{ 
                    transform: 'scale(0.8)',
                    transformOrigin: 'top center',
                  }}
                  dangerouslySetInnerHTML={{ 
                    __html: generateRankingHTML(gamesToExport, getTitle()) 
                  }}
                />
              </div>
              <p className="text-gray-400 text-sm mt-2 text-center">
                ℹ️ A imagem exportada terá qualidade total (1200x{1200 + (gamesToExport.length * 100)}px)
              </p>
            </div>

            {/* Botão Exportar */}
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Exportar como PNG
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="px-6 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
              >
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-400">
            {exportType === 'year' && !selectedYear
              ? 'Selecione um ano para ver o preview'
              : 'Nenhum jogo encontrado para este filtro'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportModal;