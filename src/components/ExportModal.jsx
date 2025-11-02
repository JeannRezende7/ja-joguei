import React, { useState, useRef } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import { 
  getTopGamesByRating, 
  getTopGamesByYear,
  getPlatinadosGames,
  getAvailableYears,
  generateRankingHTML 
} from '../utils/exportUtils';

const ExportModal = ({ games, onClose }) => {
  const [exportType, setExportType] = useState('platinados');
  const [selectedYear, setSelectedYear] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef(null);

  const availableYears = getAvailableYears(games);

  const getGamesForExport = () => {
    switch(exportType) {
      case 'platinados':
        return getPlatinadosGames(games, 10);
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
      case 'platinados':
        return 'MEU TOP 10 - PLATINADOS 🏆';
      case 'rating':
        return 'MEU TOP 10 - MELHOR AVALIADOS';
      case 'year':
        return `MEU TOP 10 - ${selectedYear || 'ANO'}`;
      default:
        return 'MEU TOP 10';
    }
  };

  const downloadImage = (dataUrl, filename) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async () => {
    if (!previewRef.current) {
      alert('Erro: Elemento não encontrado');
      return;
    }

    setIsExporting(true);
    const filename = `ja-joguei-top10-${exportType}${selectedYear ? '-' + selectedYear : ''}.png`;

    try {
      console.log('Tentativa 1: PNG de alta qualidade...');
      
      // Forçar carregamento de todas as imagens primeiro
      const images = previewRef.current.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve; // Continuar mesmo se imagem falhar
            setTimeout(resolve, 3000); // Timeout de segurança
          });
        })
      );

      const dataUrl = await toPng(previewRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#1e1b4b',
        cacheBust: true,
        skipFonts: false,
        includeQueryParams: true,
        filter: (node) => {
          // Não excluir nada
          return true;
        }
      });

      if (!dataUrl || dataUrl === 'data:,' || dataUrl.length < 100) {
        throw new Error('Imagem vazia gerada');
      }

      downloadImage(dataUrl, filename);
      console.log('✅ Exportação bem-sucedida!');
      
    } catch (error) {
      console.error('Erro na tentativa 1:', error);
      
      try {
        console.log('Tentativa 2: JPEG com configurações alternativas...');
        
        const dataUrl = await toJpeg(previewRef.current, {
          quality: 0.95,
          pixelRatio: 2,
          backgroundColor: '#1e1b4b',
          cacheBust: false,
        });

        if (!dataUrl || dataUrl === 'data:,' || dataUrl.length < 100) {
          throw new Error('Imagem vazia gerada');
        }

        downloadImage(dataUrl.replace('image/jpeg', 'image/png'), filename);
        console.log('✅ Exportação bem-sucedida (método 2)!');
        
      } catch (retryError) {
        console.error('Erro na tentativa 2:', retryError);
        
        try {
          console.log('Tentativa 3: PNG sem imagens externas...');
          
          // Remover temporariamente imagens externas
          const images = previewRef.current.querySelectorAll('img');
          const originalSrcs = [];
          images.forEach((img, i) => {
            originalSrcs[i] = img.src;
            // Substituir por placeholder se for URL externa
            if (img.src.startsWith('http') && !img.src.includes('data:')) {
              img.style.display = 'none';
            }
          });

          const dataUrl = await toPng(previewRef.current, {
            quality: 0.9,
            pixelRatio: 2,
            backgroundColor: '#1e1b4b',
          });

          // Restaurar imagens
          images.forEach((img, i) => {
            img.src = originalSrcs[i];
            img.style.display = '';
          });

          if (!dataUrl || dataUrl === 'data:,' || dataUrl.length < 100) {
            throw new Error('Imagem vazia gerada');
          }

          downloadImage(dataUrl, filename);
          console.log('✅ Exportação bem-sucedida (método 3 - sem imagens externas)!');
          alert('⚠️ Exportação concluída, mas algumas imagens de capa podem não aparecer devido a restrições de CORS. O resto do ranking foi exportado com sucesso!');
          
        } catch (finalError) {
          console.error('Erro na tentativa 3:', finalError);
          alert('❌ Erro ao exportar: As imagens dos jogos podem estar bloqueadas por CORS. Tente:\n\n1. Usar jogos sem imagens de capa\n2. Hospedar as imagens em outro servidor\n3. Usar o navegador Chrome para melhor compatibilidade');
        }
      }
    } finally {
      setIsExporting(false);
    }
  };

  const gamesToExport = getGamesForExport();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">📊 Exportar Ranking</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Opções de Exportação */}
        <div className="mb-6">
          <label className="block text-white mb-3 font-semibold">Escolha o tipo de ranking:</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setExportType('platinados')}
              className={`p-4 rounded-lg border-2 transition ${
                exportType === 'platinados'
                  ? 'border-yellow-500 bg-yellow-600 bg-opacity-20'
                  : 'border-gray-700 bg-gray-700 hover:border-yellow-500'
              }`}
            >
              <div className="text-2xl mb-2">🏆</div>
              <div className="text-white font-bold">Platinados</div>
              <div className="text-gray-400 text-sm">100% completos</div>
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
                  style={{ 
                    width: '800px',
                    maxWidth: '100%'
                  }}
                  dangerouslySetInnerHTML={{ 
                    __html: generateRankingHTML(gamesToExport, getTitle()) 
                  }}
                />
              </div>
              <p className="text-gray-400 text-sm mt-2 text-center">
                ℹ️ A imagem será exportada em 800px de largura (otimizada para mobile e desktop)
              </p>
              <p className="text-yellow-400 text-xs mt-1 text-center">
                ⚠️ Se houver problemas com CORS, algumas imagens podem não aparecer na exportação
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
              : exportType === 'platinados' 
              ? 'Você ainda não tem jogos platinados. Marque jogos como 100% completos para aparecerem aqui!'
              : 'Nenhum jogo encontrado para este filtro'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportModal;
