import { useParams } from 'react-router-dom';
import { PageHeader } from '../../components/pageHeader/PageHeader';
import Icons from '../../components/icons/Icons';

export const ConfigureMixPage = () => {
  const { mixId } = useParams();

  return (
    <div className="text-white text-2xl flex flex-col w-full">
      <PageHeader title={`Configure Mix: ${mixId}`}>
        <button className="w-[2rem] p-2">
          <Icons
            name="IconTrash"
            className="stroke-inherit hover:cursor-pointer rounded-xl hover:bg-light place-self-end"
          />
        </button>
      </PageHeader>
    </div>
  );
};
