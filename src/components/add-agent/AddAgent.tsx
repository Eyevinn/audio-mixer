import { Button } from '../button/Button';
import { Input } from '../input/Input';

export const AddAgent = () => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Input value="" onChange={(event) => console.log(event.target.value)} />
      <Button onClick={() => console.log('Should connect websocket')}>
        Connect
      </Button>
    </div>
  );
};
