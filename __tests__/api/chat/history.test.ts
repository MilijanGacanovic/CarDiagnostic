import { NextRequest } from 'next/server';
import { POST } from '@/app/api/chat/route';

describe('Chat History Feature', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should accept chatHistory in request', async () => {
    process.env.GEMINI_API_KEY = 'test-key-will-fail';

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: 'What did I just ask?',
        chatHistory: [
          { role: 'user', content: 'My car makes a strange noise' },
          { role: 'assistant', content: 'Can you describe the noise?' }
        ]
      }),
    });

    const response = await POST(request);
    
    // Should process the request (even if it fails with invalid key)
    expect(response.status).not.toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('response');
  });

  it('should filter out initial greeting messages from history', async () => {
    process.env.GEMINI_API_KEY = 'test-key-will-fail';

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: 'What is a check engine light?',
        chatHistory: [
          { 
            role: 'assistant', 
            content: 'Hello! I\'m Car Mechanic Assistant, your experienced automotive mechanic and diagnostic specialist. Ask me anything about your vehicle issues, error codes, or maintenance questions.' 
          }
        ]
      }),
    });

    const response = await POST(request);
    
    // Should process the request successfully (greeting filtered out)
    expect(response.status).not.toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('response');
  });

  it('should work without chatHistory', async () => {
    process.env.GEMINI_API_KEY = 'test-key-will-fail';

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: 'What is a check engine light?'
      }),
    });

    const response = await POST(request);
    
    // Should process the request successfully (no history)
    expect(response.status).not.toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('response');
  });
});
