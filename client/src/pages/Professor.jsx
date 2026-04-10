import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import PollForm from '../components/PollForm';
import PollCard from '../components/PollCard';
import { Button } from '../components/design';
import { useAuth } from '../context/AuthContext';

export default function Professor({ onLogout }) {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchPolls = async () => {
    try {
      const data = await api.getPolls();
      setPolls(data);
    } catch (err) {
      console.error('Error fetching polls:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleCreate = async (title, options) => {
    setCreating(true);
    try {
      const poll = await api.createPoll(title, options);
      setPolls([poll, ...polls]);
    } catch (err) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleClose = async (id) => {
    try {
      const updated = await api.closePoll(id);
      setPolls(polls.map(p => p._id === id ? updated : p));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deletePoll(id);
      setPolls(polls.filter(p => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-4">
        <div>
          <h1 className="brutal-title">PANEL PROFESOR</h1>
          {user && <p className="text-sm font-bold text-gray-500">{user.name}</p>}
        </div>
        <div className="flex gap-2">
          {onLogout && (
            <Button onClick={onLogout} variant="danger" size="sm">
              CERRAR SESION
            </Button>
          )}
        </div>
      </div>

      <PollForm 
          onSubmit={handleCreate} 
          loading={creating}
        />

      <h2 className="brutal-title text-xl mt-8 mb-4 border-b-2 border-black pb-2">MIS ENCUESTAS</h2>
      
      {loading ? (
        <div className="text-center py-8 font-bold">CARGANDO...</div>
      ) : polls.length === 0 ? (
        <div className="text-center py-8 font-bold text-gray-500">
          NO HAY ENCUESTAS TODAVIA
        </div>
      ) : (
        polls.map(poll => (
          <PollCard
            key={poll._id}
            poll={poll}
            onViewResults={(id) => navigate(`/dashboard/poll/${id}`)}
            onClose={handleClose}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}