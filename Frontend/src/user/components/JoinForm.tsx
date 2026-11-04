import { useNavigate } from 'react-router-dom';
import TextField from './TextField';
import ErrorAlert from './ErrorAlert';
import SubmitButton from './SubmitButton';
import { useJoinForm } from './hooks/useJoinForm';

export default function JoinForm() {
  const navigate = useNavigate();
  const { pin, setPin, name, setName, error, loading, handleSubmit } = useJoinForm(
    (data) => navigate(`/play/${data.sessionId}`)
  );

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4" autoComplete="off">
      <TextField
        id="pin"
        label="PIN DE EXPEDICIÓN"
        inputMode="numeric"
        value={pin}
        onChange={setPin}
        placeholder="0000"
        inputClassName="tracking-[0.2em]"
      />

      <TextField
        id="name"
        label="NOMBRE DEL EXPLORADOR"
        value={name}
        onChange={setName}
        placeholder="TU NOMBRE"
      />

      {error && <ErrorAlert message={error} />}

      <SubmitButton loading={loading} />
    </form>
  );
}