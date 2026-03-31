export interface UserMeasurements {
  height: number;
  weight: number;
  gender: string;
  chest_size?: string | null;
  waist_size?: string | null;
}

export interface SizePrediction {
  predicted_size: string;
  confidence: number;
  input_data: Record<string, unknown>;
  message: string;
  all_probabilities: Record<string, number>;
}

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function predictSize(data: UserMeasurements): Promise<SizePrediction> {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Prediction request failed');
  }

  return response.json();
}

export async function generateMeshUrl(data: UserMeasurements): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/generate-mesh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Mesh generation failed');
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}