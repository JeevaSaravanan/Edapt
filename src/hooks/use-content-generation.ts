import { useState, useCallback } from 'react';

export interface ContentGenerationRequest {
  query: string;
  narrative_style?: 'intuitive' | 'formal' | 'conversational' | 'technical';
  target_duration?: number;
  include_video?: boolean;
}

export interface GenerationStatus {
  session_id: string;
  status: 'processing' | 'completed' | 'failed' | 'not_found';
  topic?: string;
  message?: string;
}

export interface GeneratedContent {
  session_id: string;
  status: string;
  topic: string;
  mindmap_code: string;
  audio_url: string;
  video_url: string;
  narrative: {
    segments: Array<{
      segment_id: number;
      title: string;
      content: string;
      start_time: number;
      end_time: number;
      estimated_duration: number;
    }>;
    total_duration: number;
    style: string;
  };
  assets: any;
}

const API_BASE_URL = 'http://localhost:8000';

export const useContentGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus | null>(null);
  const [content, setContent] = useState<GeneratedContent | null>(null);

  const generateContent = useCallback(async (request: ContentGenerationRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: request.query,
          narrative_style: request.narrative_style || 'intuitive',
          target_duration: request.target_duration || 120,
          include_video: request.include_video !== false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate content: ${response.statusText}`);
      }

      const data = await response.json();
      setSessionId(data.session_id);
      return data.session_id;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkStatus = useCallback(async (sid: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/status/${sid}`);
      if (!response.ok) {
        throw new Error(`Failed to check status: ${response.statusText}`);
      }

      const data = await response.json();
      setStatus(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  }, []);

  const getContent = useCallback(async (sid: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/content/${sid}`);
      if (!response.ok) {
        throw new Error(`Failed to get content: ${response.statusText}`);
      }

      const data = await response.json();
      setContent(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  }, []);

  const pollUntilComplete = useCallback(async (sid: string, maxAttempts = 60, interval = 5000) => {
    for (let i = 0; i < maxAttempts; i++) {
      const statusData = await checkStatus(sid);
      
      if (statusData.status === 'completed') {
        const contentData = await getContent(sid);
        return contentData;
      } else if (statusData.status === 'failed') {
        throw new Error(statusData.message || 'Content generation failed');
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw new Error('Content generation timed out');
  }, [checkStatus, getContent]);

  return {
    loading,
    error,
    sessionId,
    status,
    content,
    generateContent,
    checkStatus,
    getContent,
    pollUntilComplete,
  };
};
