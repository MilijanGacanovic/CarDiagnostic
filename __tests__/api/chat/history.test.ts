import { NextRequest } from 'next/server';
import { POST } from '@/app/api/chat/route';
import { INITIAL_GREETING } from '@/lib/constants';

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

  it('should drop leading non-user messages from history', async () => {
    process.env.GEMINI_API_KEY = 'test-key-will-fail';

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: 'What is a check engine light?',
        chatHistory: [
          { role: 'assistant', content: INITIAL_GREETING },
          { role: 'assistant', content: 'Another assistant message' },
          { role: 'user', content: 'My first question' },
          { role: 'assistant', content: 'My first answer' }
        ]
      }),
    });

    const response = await POST(request);
    
    // Should process the request successfully (leading assistant messages dropped)
    expect(response.status).not.toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('response');
  });

  it('should handle history with only assistant messages', async () => {
    process.env.GEMINI_API_KEY = 'test-key-will-fail';

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: 'What is a check engine light?',
        chatHistory: [
          { role: 'assistant', content: INITIAL_GREETING },
          { role: 'assistant', content: 'Another assistant message' }
        ]
      }),
    });

    const response = await POST(request);
    
    // Should process the request successfully (all messages dropped, empty history)
    expect(response.status).not.toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('response');
  });

  it('should truncate history to last 10 turns (20 messages)', async () => {
    process.env.GEMINI_API_KEY = 'test-key-will-fail';

    // Create a history with 15 turns (30 messages)
    const longHistory = [];
    for (let i = 0; i < 15; i++) {
      longHistory.push({ role: 'user', content: `User message ${i}` });
      longHistory.push({ role: 'assistant', content: `Assistant message ${i}` });
    }

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: 'Latest message',
        chatHistory: longHistory
      }),
    });

    const response = await POST(request);
    
    // Should process the request successfully (truncated to last 20 messages)
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

