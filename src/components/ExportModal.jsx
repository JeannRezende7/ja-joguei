import React, { useState, useRef } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import { 
  getTopGamesByRating, 
  getTopGamesByYear,
  getPlatinadosGames,
  getAvailableYears,
  generateRankingHTML,
  getRecentGames,
  getGamesByStatus
} from '../utils/exportUtils';

const ExportModal = ({ games, onClose }) => {
  const [exportType, setExportType] = useState('platinados');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('playing');
  const [isExporting, setIsExporting] = useState(false);
  const [showRenderPreview, setShowRenderPreview] = useState(false);
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
      case 'recent':
        return getRecentGames(games, 10);
      case 'status':
        return getGamesByStatus(games, selectedStatus, 10);
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
      case 'recent':
        return 'RECÉM ADICIONADOS 🆕';
      case 'status':
        return `MEU TOP 10 - ${selectedStatus === 'playing' ? 'JOGANDO AGORA 🎮' : selectedStatus === 'completed' ? 'COMPLETADOS ✅' : selectedStatus === 'backlog' ? 'BACKLOG 📚' : 'ABANDONADOS ❌'}`;
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
    setShowRenderPreview(true); // Mostra temporariamente para renderizar
    
    const filename = `ja-joguei-top10-${exportType}${selectedYear ? '-' + selectedYear : ''}.png`;

    try {
      console.log('⏳ Aguardando renderização...');
      
      // Aguardar renderização completa
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aguardar todas as imagens carregarem
      const images = previewRef.current.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
            setTimeout(resolve, 5000); // timeout de segurança
          });
        })
      );
      
      console.log('📸 Capturando imagem...');
      
      const dataUrl = await toPng(previewRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#1e1b4b',
        cacheBust: true,
        width: 800,
        height: previewRef.current.scrollHeight,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: '800px'
        }
      });

      if (!dataUrl || dataUrl === 'data:,' || dataUrl.length < 100) {
        throw new Error('Imagem vazia gerada');
      }

      downloadImage(dataUrl, filename);
      console.log('✅ Exportação concluída!');
      alert('✅ Ranking exportado com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro:', error);
      
      try {
        console.log('🔄 Tentando método alternativo (JPEG)...');
        
        const dataUrl = await toJpeg(previewRef.current, {
          quality: 0.95,
          pixelRatio: 2,
          backgroundColor: '#1e1b4b',
          width: 800,
          height: previewRef.current.scrollHeight,
        });

        if (!dataUrl || dataUrl === 'data:,' || dataUrl.length < 100) {
          throw new Error('Falha na geração');
        }

        downloadImage(dataUrl.replace('image/jpeg', 'image/png'), filename);
        alert('✅ Ranking exportado com sucesso!');
        
      } catch (retryError) {
        console.error('❌ Falha total:', retryError);
        alert('❌ Erro ao exportar. Tente:\n\n1. Fechar e reabrir o modal\n2. Usar navegador Chrome\n3. Verificar se as imagens carregaram');
      }
    } finally {
      setIsExporting(false);
      setShowRenderPreview(false); // Esconde novamente
    }
  };

  const gamesToExport = getGamesForExport();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-gray-800 rounded-2xl p-4 md:p-6 w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white">📊 Exportar Ranking</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" disabled={isExporting}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Opções de Exportação */}
        <div className="mb-4 md:mb-6">
          <label className="block text-white mb-3 font-semibold text-sm md:text-base">Escolha o tipo de ranking:</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <button
              onClick={() => setExportType('platinados')}
              disabled={isExporting}
              className={`p-3 md:p-4 rounded-lg border-2 transition ${
                exportType === 'platinados'
                  ? 'border-yellow-500 bg-yellow-600 bg-opacity-20'
                  : 'border-gray-700 bg-gray-700 hover:border-yellow-500'
              } disabled:opacity-50`}
            >
              <div className="text-xl md:text-2xl mb-1 md:mb-2">🏆</div>
              <div className="text-white font-bold text-sm md:text-base">Platinados</div>
              <div className="text-gray-400 text-xs">100% completos</div>
            </button>

            <button
              onClick={() => setExportType('rating')}
              disabled={isExporting}
              className={`p-3 md:p-4 rounded-lg border-2 transition ${
                exportType === 'rating'
                  ? 'border-purple-500 bg-purple-600 bg-opacity-20'
                  : 'border-gray-700 bg-gray-700 hover:border-purple-500'
              } disabled:opacity-50`}
            >
              <div className="text-xl md:text-2xl mb-1 md:mb-2">⭐</div>
              <div className="text-white font-bold text-sm md:text-base">Melhor Avaliados</div>
              <div className="text-gray-400 text-xs">Por nota</div>
            </button>

            <button
              onClick={() => setExportType('year')}
              disabled={isExporting}
              className={`p-3 md:p-4 rounded-lg border-2 transition ${
                exportType === 'year'
                  ? 'border-blue-500 bg-blue-600 bg-opacity-20'
                  : 'border-gray-700 bg-gray-700 hover:border-blue-500'
              } disabled:opacity-50`}
            >
              <div className="text-xl md:text-2xl mb-1 md:mb-2">📅</div>
              <div className="text-white font-bold text-sm md:text-base">Por Ano</div>
              <div className="text-gray-400 text-xs">Escolha o ano</div>
            </button>

            <button
              onClick={() => setExportType('recent')}
              disabled={isExporting}
              className={`p-3 md:p-4 rounded-lg border-2 transition ${
                exportType === 'recent'
                  ? 'border-green-500 bg-green-600 bg-opacity-20'
                  : 'border-gray-700 bg-gray-700 hover:border-green-500'
              } disabled:opacity-50`}
            >
              <div className="text-xl md:text-2xl mb-1 md:mb-2">🆕</div>
              <div className="text-white font-bold text-sm md:text-base">Recém Adicionados</div>
              <div className="text-gray-400 text-xs">Últimos jogos</div>
            </button>

            <button
              onClick={() => setExportType('status')}
              disabled={isExporting}
              className={`p-3 md:p-4 rounded-lg border-2 transition ${
                exportType === 'status'
                  ? 'border-indigo-500 bg-indigo-600 bg-opacity-20'
                  : 'border-gray-700 bg-gray-700 hover:border-indigo-500'
              } disabled:opacity-50`}
            >
              <div className="text-xl md:text-2xl mb-1 md:mb-2">🎮</div>
              <div className="text-white font-bold text-sm md:text-base">Por Status</div>
              <div className="text-gray-400 text-xs">Jogando, etc</div>
            </button>
          </div>
        </div>

        {/* Seletor de Ano */}
        {exportType === 'year' && (
          <div className="mb-4 md:mb-6">
            <label className="block text-white mb-2 font-semibold text-sm md:text-base">Selecione o ano:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={isExporting}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 outline-none text-sm md:text-base disabled:opacity-50"
            >
              <option value="">Escolha um ano</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        )}

        {/* Seletor de Status */}
        {exportType === 'status' && (
          <div className="mb-4 md:mb-6">
            <label className="block text-white mb-2 font-semibold text-sm md:text-base">Selecione o status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={isExporting}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 outline-none text-sm md:text-base disabled:opacity-50"
            >
              <option value="playing">🎮 Jogando Agora</option>
              <option value="completed">✅ Completados</option>
              <option value="backlog">📚 Backlog</option>
              <option value="dropped">❌ Abandonados</option>
            </select>
          </div>
        )}

        {/* Elemento de renderização - escondido ou visível durante export */}
        {gamesToExport.length > 0 && (
          <div 
            style={{
              position: showRenderPreview ? 'fixed' : 'absolute',
              left: showRenderPreview ? '50%' : '-9999px',
              top: showRenderPreview ? '50%' : '-9999px',
              transform: showRenderPreview ? 'translate(-50%, -50%)' : 'none',
              zIndex: showRenderPreview ? 9999 : -1,
              width: '800px',
              maxHeight: showRenderPreview ? '90vh' : 'none',
              overflow: showRenderPreview ? 'auto' : 'visible',
              backgroundColor: showRenderPreview ? '#1e1b4b' : 'transparent',
              padding: showRenderPreview ? '20px' : '0',
              borderRadius: showRenderPreview ? '10px' : '0',
              boxShadow: showRenderPreview ? '0 0 50px rgba(0,0,0,0.5)' : 'none'
            }}
          >
            <div 
              ref={previewRef}
              dangerouslySetInnerHTML={{ 
                __html: generateRankingHTML(gamesToExport, getTitle()) 
              }}
            />
            {showRenderPreview && (
              <div className="mt-4 text-center text-white text-lg">
                <Loader2 className="w-8 h-8 animate-spin inline-block" />
                <p className="mt-2">Gerando imagem...</p>
                <p className="text-sm text-gray-300">Aguarde alguns segundos</p>
              </div>
            )}
          </div>
        )}

        {/* Informações sobre a exportação */}
        {gamesToExport.length > 0 ? (
          <>
            <div className="mb-6 bg-slate-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                📊 Resumo da Exportação
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                <div className="bg-slate-600 rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-400">{gamesToExport.length}</div>
                  <div className="text-gray-300 text-sm">Jogos</div>
                </div>
                <div className="bg-slate-600 rounded-lg p-3">
                  <div className="text-2xl font-bold text-yellow-400">
                    {(gamesToExport.reduce((acc, g) => acc + g.rating, 0) / gamesToExport.length).toFixed(1)}
                  </div>
                  <div className="text-gray-300 text-sm">Nota Média</div>
                </div>
                <div className="bg-slate-600 rounded-lg p-3 col-span-2 md:col-span-1">
                  <div className="text-2xl font-bold text-green-400">
                    {gamesToExport.filter(g => g.platinado).length}
                  </div>
                  <div className="text-gray-300 text-sm">Platinados</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-500">
                <p className="text-blue-200 text-sm text-center">
                  ℹ️ A imagem será gerada em 800px • Aguarde alguns segundos após clicar
                </p>
              </div>
            </div>

            {/* Botão Exportar */}
            <div className="flex flex-col md:flex-row gap-3">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm md:text-base shadow-lg"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Gerando imagem...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Gerar e Baixar PNG
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                disabled={isExporting}
                className="px-6 bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-lg font-semibold transition text-sm md:text-base disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-400 text-sm md:text-base">
            {exportType === 'year' && !selectedYear
              ? '📅 Selecione um ano para continuar'
              : exportType === 'platinados' 
              ? '🏆 Você ainda não tem jogos platinados. Marque jogos como 100% completos para aparecerem aqui!'
              : '❌ Nenhum jogo encontrado para este filtro'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportModal;