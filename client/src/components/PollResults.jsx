import { useState, useMemo } from 'react';
import { Button, Card } from './design';

const COLORS = ['#2962FF', '#4CAF50', '#FF5722', '#E53935', '#9C27B0', '#00BCD4', '#FFC107', '#607D8B'];

export default function PollResults({ poll, votes, onClose }) {
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const total = poll.totalVotes || 0;
    return poll.options.map((opt, idx) => ({
      text: opt.text,
      votes: opt.votes,
      percentage: total > 0 ? Math.round((opt.votes / total) * 100) : 0,
      color: COLORS[idx % COLORS.length]
    }));
  }, [poll.options, poll.totalVotes]);

  const maxVotes = Math.max(...stats.map(s => s.votes), 1);

  const copyCode = () => {
    navigator.clipboard.writeText(poll.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <div className="flex flex-col sm:flex-row items-start sm:justify-between sm:items-center gap-3 mb-6 border-b-4 border-black pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="brutal-title text-xl sm:text-2xl">{poll.title}</h2>
          <span className={poll.status === 'active'
            ? 'brutal-badge-success'
            : 'brutal-badge bg-gray-400 text-white'
          }>
            {poll.status === 'active' ? 'ACTIVA' : 'CERRADA'}
          </span>
        </div>
        {poll.status === 'active' && onClose && (
          <Button onClick={onClose} variant="danger" size="sm">
            CERRAR ENCUESTA
          </Button>
        )}
      </div>

      <div className="bg-yellow-400 border-4 border-black p-6 mb-6 text-center shadow-brutal">
        <p className="text-sm font-bold uppercase tracking-widest mb-2 border-b-2 border-black inline-block px-4">
          CODIGO DE ACCESO
        </p>
        <p className="font-mono text-4xl sm:text-6xl font-bold tracking-[0.2em] sm:tracking-[0.3em] mt-3 bg-black text-yellow-400 px-4 py-2 sm:px-6 sm:py-3 inline-block break-all">
          {poll.code}
        </p>
        <button
          onClick={copyCode}
          className="mt-4 block w-full text-sm font-bold uppercase tracking-wide border-2 border-black px-4 py-3 bg-white hover:bg-black hover:text-white transition-all"
        >
          {copied ? '>>> COPIADO <<<' : '>>> COPIAR CODIGO <<<'}
        </button>
      </div>

      <div className="mb-6">
        <div className="border-4 border-black p-1">
          <div className="bg-black text-white text-center py-2 font-bold uppercase tracking-widest">
            GRAFICO DE RESULTADOS
          </div>
          <div className="bg-white p-4 space-y-3">
            {stats.map((stat, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-end mb-1">
                  <span className="font-bold text-sm">{stat.text}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono font-bold text-xl">{stat.votes}</span>
                    <span className="font-bold text-sm">({stat.percentage}%)</span>
                  </div>
                </div>
                <div className="h-8 border-2 border-black relative overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500"
                    style={{ 
                      width: `${(stat.votes / maxVotes) * 100}%`,
                      backgroundColor: stat.color
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-end pr-2">
                    {stat.votes > 0 && (
                      <span className="font-bold text-white text-sm drop-shadow-md">
                        {stat.percentage}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="brutal-label mb-2">RESUMEN DE VOTOS</h3>
        <div className="border-2 border-black">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="flex justify-between items-center py-3 px-4 border-b-2 border-black last:border-b-0"
              style={{ backgroundColor: idx % 2 === 0 ? '#F5F5F0' : '#FFFFFF' }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 border-2 border-black"
                  style={{ backgroundColor: stat.color }}
                />
                <span className="font-bold">{stat.text}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-lg">{stat.votes}</span>
                <span className="text-sm font-bold text-gray-500">votos</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="brutal-label mb-2">VOTOS RECIBIDOS ({votes.length})</h3>
        {votes.length === 0 ? (
          <div className="border-2 border-black p-4 text-center font-bold text-gray-500 bg-gray-100">
            AUN NO HAY VOTOS
          </div>
        ) : (
          <div className="border-2 border-black max-h-64 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-black text-white sticky top-0">
                <tr>
                  <th className="text-left px-3 py-2 font-bold text-sm">NOMBRE</th>
                  <th className="text-left px-3 py-2 font-bold text-sm">OPCION</th>
                  <th className="text-right px-3 py-2 font-bold text-sm">HORA</th>
                </tr>
              </thead>
              <tbody>
                {votes.map((vote, idx) => (
                  <tr 
                    key={vote._id} 
                    className="border-b border-black last:border-b-0"
                    style={{ backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F5F5F0' }}
                  >
                    <td className="px-3 py-2 font-bold text-sm">{vote.voterName}</td>
                    <td className="px-3 py-2 text-sm">{vote.optionText}</td>
                    <td className="px-3 py-2 text-sm text-right font-mono">{vote.formattedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="text-center pt-6 border-t-4 border-black bg-black text-white py-4">
        <span className="font-bold text-xl tracking-widest">TOTAL: </span>
        <span className="font-mono text-2xl sm:text-4xl font-bold">{poll.totalVotes}</span>
        <span className="font-bold text-xl ml-2">VOTO{poll.totalVotes !== 1 ? 'S' : ''}</span>
      </div>
    </Card>
  );
}