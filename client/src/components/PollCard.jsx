import { useState } from 'react';
import { Button } from './design';
import ConfirmModal from './ConfirmModal';

export default function PollCard({ poll, onViewResults, onDelete, onClose }) {
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);

  const handleClose = async () => {
    setLoading(true);
    try {
      await onClose(poll._id);
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
    setCloseModalOpen(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(poll._id);
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
    setDeleteModalOpen(false);
  };

  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);
  const openCloseModal = () => setCloseModalOpen(true);
  const closeCloseModal = () => setCloseModalOpen(false);

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="brutal-card mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg">{poll.title}</h3>
          <div className="mt-2">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">Codigo de acceso</p>
            <p className="font-mono font-bold bg-yellow-400 px-2 py-1 border-2 border-black inline-block">
              {poll.code}
            </p>
          </div>
        </div>
        <span className={poll.status === 'active' 
          ? 'brutal-badge-success' 
          : 'brutal-badge bg-gray-400 text-white'
        }>
          {poll.status === 'active' ? 'ACTIVA' : 'CERRADA'}
        </span>
      </div>

      <p className="text-sm font-bold uppercase tracking-wide mb-4">
        {totalVotes} voto{totalVotes !== 1 ? 's' : ''} — {new Date(poll.createdAt).toLocaleDateString()}
      </p>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => onViewResults(poll._id)}
          variant="secondary"
          size="sm"
        >
          RESULTADOS
        </Button>
        {poll.status === 'active' && (
          <Button
            onClick={openCloseModal}
            disabled={loading}
            variant="secondary"
            size="sm"
          >
            CERRAR ENCUESTA
          </Button>
        )}
        <Button
          onClick={openDeleteModal}
          disabled={loading}
          variant="danger"
          size="sm"
        >
          ELIMINAR
        </Button>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="ELIMINAR ENCUESTA"
        message="Se perderán todos los votos. ¿Estás seguro?"
        confirmText="ELIMINAR"
        cancelText="CANCELAR"
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
      />

      <ConfirmModal
        isOpen={closeModalOpen}
        title="CERRAR ENCUESTA"
        message="¿Seguro que quieres cerrar esta encuesta?"
        confirmText="CERRAR ENCUESTA"
        cancelText="CANCELAR"
        onConfirm={handleClose}
        onCancel={closeCloseModal}
      />
    </div>
  );
}