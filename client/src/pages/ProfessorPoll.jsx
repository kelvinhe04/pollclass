import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PollResults from '../components/PollResults';
import { Button } from '../components/design';
import ConfirmModal from '../components/ConfirmModal';

export default function ProfessorPoll({ onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);

  const fetchResults = async () => {
    try {
      const result = await api.getResults(id);
      setData(result);
    } catch (err) {
      console.error('Error fetching results:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 3000);
    return () => clearInterval(interval);
  }, [id]);

  const handleConfirmClose = async () => {
    setClosing(true);
    try {
      await api.closePoll(id);
      await fetchResults();
    } catch (err) {
      alert(err.message);
    } finally {
      setClosing(false);
      setCloseModalOpen(false);
    }
  };

  const openCloseModal = () => setCloseModalOpen(true);
  const closeCloseModal = () => setCloseModalOpen(false);

  if (loading) {
    return (
      <div className="min-h-screen p-4 max-w-2xl mx-auto flex items-center justify-center">
        <div className="font-bold text-xl">CARGANDO...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen p-4 max-w-2xl mx-auto">
        <div className="brutal-card">
          <p className="text-red-600 font-bold">ENCUESTA NO ENCONTRADA</p>
          <Button onClick={() => navigate('/dashboard')} variant="secondary" className="mt-4">
            VOLVER AL PANEL
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <div className="flex flex-wrap sm:flex-nowrap justify-between gap-2 mb-4">
        <Button onClick={() => navigate('/dashboard')} variant="secondary" size="sm">
          VOLVER
        </Button>
        {onLogout && (
          <Button onClick={onLogout} variant="danger" size="sm">
            CERRAR SESION
          </Button>
        )}
      </div>

      <PollResults
        poll={data.poll}
        votes={data.votes}
        onClose={openCloseModal}
      />

      <ConfirmModal
        isOpen={closeModalOpen}
        title="CERRAR ENCUESTA"
        message="¿Seguro que quieres cerrar esta encuesta?"
        confirmText="CERRAR ENCUESTA"
        cancelText="CANCELAR"
        onConfirm={handleConfirmClose}
        onCancel={closeCloseModal}
      />
    </div>
  );
}