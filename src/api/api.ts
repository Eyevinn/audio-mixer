import { handleFetchRequest } from './handle-fetch-request';

const API_URL = process.env.REACT_APP_BACKEND_API_URL;

export const SendWsAdress = {
  createWsConnection: async ({ url }: { url: string }) =>
    handleFetchRequest<string>(
      // TODO: Update the URL-endpoint to the correct one
      fetch(`${API_URL}something/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url
        })
      })
    )
};

export const CreateAgent = {
  // TODO: Update the parameters to the correct ones
  createWsConnection: async ({ url }: { url: string }) =>
    handleFetchRequest<string>(
      // TODO: Update the URL-endpoint to the correct one
      fetch(`${API_URL}something/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url
        })
      })
    )
};

export const DeleteAgent = {
  // TODO: Update the parameters to the correct ones
  createWsConnection: async () =>
    handleFetchRequest<string>(
      // TODO: Update the URL-endpoint to the correct one
      fetch(`${API_URL}something/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    )
};
