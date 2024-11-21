const API_URL = 'http://localhost:8000/api';

export const convertDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/documents/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to convert document');
  }

  return await response.json();
};

export const downloadDocument = async (documentId) => {
  const response = await fetch(`${API_URL}/documents/${documentId}/download/`);
  if (!response.ok) {
    throw new Error('Failed to download document');
  }
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};