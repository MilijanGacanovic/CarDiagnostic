import { NextRequest } from 'next/server';
import { POST } from '@/app/api/chat/route';

describe('Chat API Endpoint', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment before each test
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  it('should return 400 when message is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Message is required');
  });

  it('should return 400 when message is not a string', async () => {
    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 123 }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Message is required');
  });

  it('should return 503 when GEMINI_API_KEY is missing', async () => {
    // Remove API key from environment
    delete process.env.GEMINI_API_KEY;

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: 'What is wrong with my car?',
        chatHistory: []
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.response).toContain('unavailable');
    expect(data.error).toBe('Service unavailable');
  });

  it('should validate request structure with valid message', async () => {
    // Set a dummy API key (won't actually call Gemini in this test)
    process.env.GEMINI_API_KEY = 'test-key-will-fail';

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: 'What is wrong with my car?',
        chatHistory: [
          { role: 'assistant', content: 'Hello! How can I help?' }
        ]
      }),
    });

    const response = await POST(request);
    
    // With an invalid key, we expect an error response but not a validation error
    expect(response.status).not.toBe(400);
    
    const data = await response.json();
    
    // Should have a response field (either success or error message)
    expect(data).toHaveProperty('response');
    expect(typeof data.response).toBe('string');
  });
});
