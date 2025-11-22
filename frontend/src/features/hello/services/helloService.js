import { apiClient } from '../../../services/apiClient';

export async function getHelloMessage() {
  const response = await apiClient.get('/api/hello');
  return response.text();
}
