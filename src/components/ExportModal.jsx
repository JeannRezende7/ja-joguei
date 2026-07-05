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

const EXPORT_OPTIONS = [
  { value: 'platinados', emoji: '🏆', title: 'Platinados', subtitle: '100% completos', accent: 'border-amber-500 bg-amber-500/10' },
  { value: 'rating', emoji: '⭐', title: 'Melhor Avaliados', subtitle: 'Por nota', accent: 'border-violet-500 bg-violet-500/10' },
  { value: 'year', emoji: '📅', title: 'Por Ano', subtitle: 'Escolha o ano', accent: 'border-blue-500 bg-blue-500/10' },
  { value: 'recent', emoji: '🆕', title: 'Recém Adicionados', subtitle: 'Últimos jogos', accent: 'border-emerald-500 bg-emerald-500/10' },
  { value: 'status', emoji: '🎮', title: 'Por Status', subtitle: 'Jogando, etc', accent: 'border-indigo-500 bg-indigo-500/10' },
];

const ExportModal = ({ games, onClose }) => {
  const [exportType, setExportType] = useState('platinados');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('playing');
  const [isExporting, setIsExporting] = useState(false);
  const [showRenderPreview, setShowRenderPreview] = useState(false);
  const previewRef = useRef(null);

  const availableYears = getAvailableYears(games);

  const getGamesForExport = () => {
    switch (exportType) {
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
    switch (exportType) {
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
    setShowRenderPreview(true);

    const filename = `ja-joguei-top10-${exportType}${selectedYear ? '-' + selectedYear : ''}.png`;

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const images = previewRef.current.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
            setTimeout(resolve, 5000);
          });
        })
      );

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
      alert('✅ Ranking exportado com sucesso!');

    } catch (error) {
      console.error('Erro:', error);

      try {
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
        console.error('Falha total:', retryError);
        alert('❌ Erro ao exportar. Tente:\n\n1. Fechar e reabrir o modal\n2. Usar navegador Chrome\n3. Verificar se as imagens carregaram');
      }
    } finally {
      setIsExporting(false);
      setShowRenderPreview(false);
    }
  };

  const gamesToExport = getGamesForExport();

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex sm:items-center sm:justify-center sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 w-full min-h-full sm:min-h-0 sm:rounded-2xl sm:border sm:border-slate-800 sm:max-w-4xl sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">📊 Exportar Ranking</h2>
          <button onClick={onClose} className="text-slate-400 active:text-white p-1" disabled={isExporting}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-5">
            <label className="block text-slate-300 mb-3 font-medium text-sm">Escolha o tipo de ranking:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {EXPORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setExportType(opt.value)}
                  disabled={isExporting}
                  className={`p-3 rounded-lg border transition disabled:opacity-50 text-left ${
                    exportType === opt.value ? opt.accent : 'border-slate-800 bg-slate-800/50 active:border-slate-700'
                  }`}
                >
                  <div className="text-xl mb-1">{opt.emoji}</div>
                  <div className="text-white font-semibold text-sm">{opt.title}</div>
                  <div className="text-slate-500 text-xs">{opt.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          {exportType === 'year' && (
            <div className="mb-5">
              <label className="block text-slate-300 mb-2 font-medium text-sm">Selecione o ano:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                disabled={isExporting}
                className="input-field disabled:opacity-50"
                style={{ colorScheme: 'dark' }}
              >
                <option value="">Escolha um ano</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}

          {exportType === 'status' && (
            <div className="mb-5">
              <label className="block text-slate-300 mb-2 font-medium text-sm">Selecione o status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                disabled={isExporting}
                className="input-field disabled:opacity-50"
                style={{ colorScheme: 'dark' }}
              >
                <option value="playing">🎮 Jogando Agora</option>
                <option value="completed">✅ Completados</option>
                <option value="backlog">📚 Backlog</option>
                <option value="dropped">❌ Abandonados</option>
              </select>
            </div>
          )}

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
                  <p className="text-sm text-slate-300">Aguarde alguns segundos</p>
                </div>
              )}
            </div>
          )}

          {gamesToExport.length > 0 ? (
            <>
              <div className="mb-5 surface p-4">
                <h3 className="text-white font-semibold mb-3 text-sm">Resumo da Exportação</h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-800/70 rounded-lg p-3">
                    <div className="text-xl font-bold text-violet-400">{gamesToExport.length}</div>
                    <div className="text-slate-400 text-xs">Jogos</div>
                  </div>
                  <div className="bg-slate-800/70 rounded-lg p-3">
                    <div className="text-xl font-bold text-amber-400">
                      {(gamesToExport.reduce((acc, g) => acc + g.rating, 0) / gamesToExport.length).toFixed(1)}
                    </div>
                    <div className="text-slate-400 text-xs">Nota Média</div>
                  </div>
                  <div className="bg-slate-800/70 rounded-lg p-3">
                    <div className="text-xl font-bold text-emerald-400">
                      {gamesToExport.filter(g => g.platinado).length}
                    </div>
                    <div className="text-slate-400 text-xs">Platinados</div>
                  </div>
                </div>

                <div className="mt-3 p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-300 text-xs text-center">
                    A imagem será gerada em 800px • aguarde alguns segundos após clicar
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pb-safe">
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="btn-primary flex-1 py-3.5 flex items-center justify-center gap-2 text-sm"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Gerando imagem...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Gerar e Baixar PNG
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  disabled={isExporting}
                  className="btn-secondary px-6 py-3.5 text-sm disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500 text-sm">
              {exportType === 'year' && !selectedYear
                ? '📅 Selecione um ano para continuar'
                : exportType === 'platinados'
                ? '🏆 Você ainda não tem jogos platinados. Marque jogos como 100% completos para aparecerem aqui!'
                : '❌ Nenhum jogo encontrado para este filtro'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
