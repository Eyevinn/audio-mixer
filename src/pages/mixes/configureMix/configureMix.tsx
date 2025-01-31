import { useParams } from 'react-router-dom';

export const ConfigureMixPage = () => {
  const { mixId } = useParams();

  return <div className="text-white text-2xl">Configure Mix: {mixId}</div>;
};
