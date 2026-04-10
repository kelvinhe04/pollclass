import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import JoinPoll from '../components/JoinPoll';
import VoteForm from '../components/VoteForm';
import PollResults from '../components/PollResults';
import { Button, Card } from '../components/design';
import { useAuth } from '../context/AuthContext';

export default function Student({ onLogout }) {
  const [view, setView] = useState('join');
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [voting, setVoting] = useState(false);
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleJoin = async (code) => {
    setLoading(true);
    setError('');
    try {
      const pollData = await api.getPollForStudent(code);
      setPoll(pollData);
      
      if (pollData.alreadyVoted) {
        setView('already-voted');
        fetchResults();
      } else {
        setView('vote');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (optionIndex) => {
    setVoting(true);
    setError('');
    setSelectedOptionIndex(optionIndex);
    try {
      await api.vote(poll._id, optionIndex);
      setView('results');
      fetchResults();
    } catch (err) {
      setError(err.message);
      if (err.message.includes('Ya has voted') || err.message.includes('409')) {
        setView('results');
        fetchResults();
      }
    } finally {
      setVoting(false);
    }
  };

  const fetchResults = async () => {
    try {
      const result = await api.getResults(poll._id);
      setResults(result);
    } catch (err) {
      console.error('Error fetching results:', err);
    }
  };

  useEffect(() => {
    if ((view === 'results' || view === 'already-voted') && poll) {
      fetchResults();
      const interval = setInterval(fetchResults, 5000);
      return () => clearInterval(interval);
    }
  }, [view, poll?._id]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReset = () => {
    setView('join');
    setPoll(null);
    setError('');
    setResults(null);
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await api.getStudentHistory();
      setHistory(data.history || []);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'join') {
      fetchHistory();
    }
  }, [view]);

  const handleViewHistoryPoll = async (pollId) => {
    setLoading(true);
    setError('');
    try {
      const pollData = await api.getPollById(pollId);
      setPoll(pollData);
      setView('already-voted');
      if (pollData.existingVote?.optionIndex !== undefined) {
        setSelectedOptionIndex(pollData.existingVote.optionIndex);
      }
      fetchResults();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6 border-b-2 border-black pb-4">
        <div>
          <h1 className="brutal-title">VISTA ESTUDIANTE</h1>
          {user && <p className="text-sm font-bold text-gray-500">{user.name}</p>}
        </div>
        <div className="flex gap-2">
          {view !== 'join' && (
            <Button onClick={handleReset} variant="secondary" size="sm">
              VOLVER
            </Button>
          )}
          {onLogout && (
            <Button onClick={onLogout} variant="danger" size="sm">
              CERRAR SESION
            </Button>
          )}
        </div>
      </div>

      {view === 'join' && (
        <>
          <JoinPoll onJoin={(code) => handleJoin(code)} loading={loading} error={error} />
          
          <div className="mt-8 border-t-4 border-black pt-6">
            <h2 className="brutal-title text-2xl mb-4">HISTORIAL DE ENCUESTAS</h2>
            
            {historyLoading ? (
              <div className="border-2 border-black p-4 text-center font-bold">
                CARGANDO...
              </div>
            ) : history.length === 0 ? (
              <div className="border-2 border-black p-6 text-center font-bold text-gray-500 bg-gray-100">
                AUN NO HAS VOTADO EN NINGUNA ENCUESTA
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <div key={item.pollId} className="border-2 border-black p-4 bg-white">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <span className={`px-2 py-1 text-xs font-bold uppercase border-2 border-black ${item.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                        {item.status === 'active' ? 'ACTIVA' : 'CERRADA'}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm mb-6">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">Codigo de acceso</p>
                        <span className="font-mono font-bold bg-yellow-400 px-2 py-1 border-2 border-black inline-block">{item.code}</span>
                      </div>
                    </div>
                    <div className="mb-3 p-3 bg-gray-100 border-2 border-black">
                      <span className="text-xs font-bold uppercase text-gray-600">Tu voto:</span>
                      <p className="font-bold">{item.votedOptionText}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{item.formattedAt}</span>
                      <Button onClick={() => handleViewHistoryPoll(item.pollId)} variant="secondary" size="sm">
                        VER RESULTADOS
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {view === 'vote' && poll && (
        <Card title="VOTAR">
          <div className="mb-4">
            <span className="text-sm font-bold uppercase tracking-wide text-gray-600">Encuesta:</span>
            <h2 className="font-bold text-lg">{poll.title}</h2>
          </div>

          {error && (
            <div className="bg-red-600 text-white border-2 border-black p-4 mb-4 font-bold">
              {error}
            </div>
          )}

          <div className="mb-4 p-3 bg-yellow-400 border-2 border-black">
            <span className="text-sm font-bold uppercase tracking-wide">Votando como: </span>
            <strong className="font-bold text-lg">{user?.name}</strong>
          </div>

          <VoteForm options={poll.options} onVote={handleVote} loading={voting} />

          <button onClick={() => { handleReset(); navigate('/student'); }} className="mt-4 text-sm font-bold uppercase tracking-wide w-full text-center hover:underline">
            SALIR DE ENCUESTA
          </button>
        </Card>
      )}

      {view === 'already-voted' && poll && (
        <div className="space-y-4">
          <div className="bg-gray-600 text-white border-2 border-black p-4 text-center font-bold">
            YA VOTASTE EN ESTA ENCUESTA
          </div>

          <Card title="TU VOTO">
            <div className="p-4 bg-green-500 border-2 border-black">
              <span className="text-sm font-bold uppercase tracking-wide text-green-900">Opcion elegida:</span>
              <p className="font-bold text-xl mt-1">{poll.existingVote?.optionText}</p>
            </div>
            {poll.existingVote?.createdAt && (
              <p className="mt-3 text-sm font-bold text-gray-600">
                Fecha: {formatDate(poll.existingVote.createdAt)}
              </p>
            )}
          </Card>

          <PollResults poll={poll} votes={results?.votes || []} />

          <Button onClick={handleReset} variant="secondary" className="w-full">
            VOTAR EN OTRA ENCUESTA
          </Button>
        </div>
      )}

      {view === 'results' && results && (
        <div className="space-y-4">
          <div className="bg-green-600 text-white border-2 border-black p-4 text-center font-bold">
            VOTO REGISTRADO
          </div>
          
          <Card title="TU VOTO">
            <div className="p-4 bg-green-500 border-2 border-black">
              <span className="text-sm font-bold uppercase tracking-wide text-green-900">Opcion elegida:</span>
              <p className="font-bold text-xl mt-1">{results.poll.options[selectedOptionIndex]?.text}</p>
            </div>
          </Card>

          <PollResults poll={results.poll} votes={results.votes} />

          <Button onClick={handleReset} variant="secondary" className="w-full">
            VOTAR EN OTRA ENCUESTA
          </Button>
        </div>
      )}
    </div>
  );
}