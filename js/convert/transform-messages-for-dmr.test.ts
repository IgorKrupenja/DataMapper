import { describe, expect, it } from 'vitest';

import transformMessagesForDmr from './transform-messages-for-dmr.js';

describe('transformMessagesForDmr', () => {
  it('should transform messages with aliased fields (get-chat-messages format)', () => {
    const input = [
      {
        id: 'message-id-1',
        chat_id: 'chat-id-1',
        content: 'Hello',
        author_timestamp: '2025-12-31T06:52:38.330+00:00',
        author_role: 'end-user',
        created: '2025-12-31T06:52:38.330+00:00',
      },
      {
        id: 'message-id-2',
        chat_id: 'chat-id-1',
        content: 'How can I help?',
        author_timestamp: '2025-12-31T06:52:41.483+00:00',
        author_role: 'buerokratt',
        created: '2025-12-31T06:52:41.483+00:00',
      },
    ];

    const result = transformMessagesForDmr(input);
    const expected = [
      {
        id: 'message-id-1',
        chatId: 'chat-id-1',
        content: 'Hello',
        authorTimestamp: '2025-12-31T06:52:38.330+00:00',
        authorRole: 'end-user',
      },
      {
        id: 'message-id-2',
        chatId: 'chat-id-1',
        content: 'How can I help?',
        authorTimestamp: '2025-12-31T06:52:41.483+00:00',
        authorRole: 'buerokratt',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('should transform messages with base fields (get-messages-by-ids format)', () => {
    const input = [
      {
        base_id: 'cdf7c2f3-93e8-4f2e-a11c-328b75cc41f2',
        chat_base_id: '9f81c122-c82c-4cff-b9b4-52ecfe343cc7',
        content: 'Tere',
        author_timestamp: '2025-12-31T06:52:38.187+00',
        author_role: 'buerokratt',
        created: '2025-12-31T06:52:38.188+00',
      },
      {
        base_id: '427cd04b-c298-4aed-9c7d-d59c5d92bad4',
        chat_base_id: '9f81c122-c82c-4cff-b9b4-52ecfe343cc7',
        content: 'tere',
        author_timestamp: '2025-12-31T06:52:37.661+00',
        author_role: 'end-user',
        created: '2025-12-31T06:52:38.33+00',
      },
    ];

    const result = transformMessagesForDmr(input);
    const expected = [
      {
        id: 'cdf7c2f3-93e8-4f2e-a11c-328b75cc41f2',
        chatId: '9f81c122-c82c-4cff-b9b4-52ecfe343cc7',
        content: 'Tere',
        authorTimestamp: '2025-12-31T06:52:38.187+00',
        authorRole: 'buerokratt',
      },
      {
        id: '427cd04b-c298-4aed-9c7d-d59c5d92bad4',
        chatId: '9f81c122-c82c-4cff-b9b4-52ecfe343cc7',
        content: 'tere',
        authorTimestamp: '2025-12-31T06:52:37.661+00',
        authorRole: 'end-user',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('should prefer aliased fields over base fields when both exist', () => {
    const input = [
      {
        id: 'aliased-id',
        base_id: 'base-id',
        chat_id: 'aliased-chat-id',
        chat_base_id: 'base-chat-id',
        content: 'Test',
        author_timestamp: '2025-12-31T06:52:38.330+00:00',
        author_role: 'end-user',
        created: '2025-12-31T06:52:38.330+00:00',
      },
    ];

    const result = transformMessagesForDmr(input);
    const expected = [
      {
        id: 'aliased-id',
        chatId: 'aliased-chat-id',
        content: 'Test',
        authorTimestamp: '2025-12-31T06:52:38.330+00:00',
        authorRole: 'end-user',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('should use created as fallback when author_timestamp is missing', () => {
    const input = [
      {
        id: 'message-id-1',
        chat_id: 'chat-id-1',
        content: 'Hello',
        created: '2025-12-31T06:52:38.330+00:00',
        author_role: 'end-user',
      },
    ];

    const result = transformMessagesForDmr(input);
    const expected = [
      {
        id: 'message-id-1',
        chatId: 'chat-id-1',
        content: 'Hello',
        authorTimestamp: '2025-12-31T06:52:38.330+00:00',
        authorRole: 'end-user',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('should handle missing optional fields with empty strings', () => {
    const input = [
      {
        base_id: 'message-id-1',
        chat_base_id: 'chat-id-1',
        content: 'Hello',
        created: '2025-12-31T06:52:38.330+00:00',
        // author_role is missing
      },
    ];

    const result = transformMessagesForDmr(input);
    const expected = [
      {
        id: 'message-id-1',
        chatId: 'chat-id-1',
        content: 'Hello',
        authorTimestamp: '2025-12-31T06:52:38.330+00:00',
        authorRole: '',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('should handle empty content', () => {
    const input = [
      {
        id: 'message-id-1',
        chat_id: 'chat-id-1',
        content: '',
        author_timestamp: '2025-12-31T06:52:38.330+00:00',
        author_role: 'end-user',
      },
    ];

    const result = transformMessagesForDmr(input);
    const expected = [
      {
        id: 'message-id-1',
        chatId: 'chat-id-1',
        content: '',
        authorTimestamp: '2025-12-31T06:52:38.330+00:00',
        authorRole: 'end-user',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('should handle empty array', () => {
    const input: unknown[] = [];
    const result = transformMessagesForDmr(input);
    expect(result).toEqual([]);
  });

  it('should return empty array for non-array input', () => {
    expect(transformMessagesForDmr(null as unknown as unknown[])).toEqual([]);
    expect(transformMessagesForDmr(undefined as unknown as unknown[])).toEqual([]);
    expect(transformMessagesForDmr('not an array' as unknown as unknown[])).toEqual([]);
    expect(transformMessagesForDmr({} as unknown as unknown[])).toEqual([]);
  });

  it('should handle null and undefined values in fields', () => {
    const input = [
      {
        id: null,
        base_id: 'fallback-id',
        chat_id: null,
        chat_base_id: 'fallback-chat-id',
        content: 'Hello',
        author_timestamp: null,
        created: '2025-12-31T06:52:38.330+00:00',
        author_role: null,
      },
    ];

    const result = transformMessagesForDmr(input);
    const expected = [
      {
        id: 'fallback-id',
        chatId: 'fallback-chat-id',
        content: 'Hello',
        authorTimestamp: '2025-12-31T06:52:38.330+00:00',
        authorRole: '',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('should handle mixed message formats in the same array', () => {
    const input = [
      {
        id: 'aliased-id',
        chat_id: 'aliased-chat-id',
        content: 'First message',
        author_timestamp: '2025-12-31T06:52:38.330+00:00',
        author_role: 'end-user',
      },
      {
        base_id: 'base-id',
        chat_base_id: 'base-chat-id',
        content: 'Second message',
        created: '2025-12-31T06:52:39.330+00:00',
        author_role: 'buerokratt',
      },
    ];

    const result = transformMessagesForDmr(input);
    const expected = [
      {
        id: 'aliased-id',
        chatId: 'aliased-chat-id',
        content: 'First message',
        authorTimestamp: '2025-12-31T06:52:38.330+00:00',
        authorRole: 'end-user',
      },
      {
        id: 'base-id',
        chatId: 'base-chat-id',
        content: 'Second message',
        authorTimestamp: '2025-12-31T06:52:39.330+00:00',
        authorRole: 'buerokratt',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('should handle camelCase field names (chatBaseId, baseId)', () => {
    const input = [
      {
        chatBaseId: '9f81c122-c82c-4cff-b9b4-52ecfe343cc7',
        baseId: '427cd04b-c298-4aed-9c7d-d59c5d92bad4',
        content: 'tere',
        authorTimestamp: '2025-12-31T06:52:37.661+00:00',
        authorRole: 'end-user',
        created: '2025-12-31T06:52:38.330+00:00',
      },
      {
        chatBaseId: '9f81c122-c82c-4cff-b9b4-52ecfe343cc7',
        baseId: 'fb5e866c-496a-f3d6-17ed-8a1703908ae7',
        content: 'Kuidas saan abiks olla?',
        authorTimestamp: '2025-12-31T06:52:41.483+00:00',
        authorRole: 'buerokratt',
        created: '2025-12-31T06:52:41.483+00:00',
      },
    ];

    const result = transformMessagesForDmr(input);
    const expected = [
      {
        id: '427cd04b-c298-4aed-9c7d-d59c5d92bad4',
        chatId: '9f81c122-c82c-4cff-b9b4-52ecfe343cc7',
        content: 'tere',
        authorTimestamp: '2025-12-31T06:52:37.661+00:00',
        authorRole: 'end-user',
      },
      {
        id: 'fb5e866c-496a-f3d6-17ed-8a1703908ae7',
        chatId: '9f81c122-c82c-4cff-b9b4-52ecfe343cc7',
        content: 'Kuidas saan abiks olla?',
        authorTimestamp: '2025-12-31T06:52:41.483+00:00',
        authorRole: 'buerokratt',
      },
    ];

    expect(result).toEqual(expected);
  });
});

