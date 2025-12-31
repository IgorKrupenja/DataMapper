/**
 * Transforms messages from database format to DMR format
 * Handles both query result structures:
 * - get-chat-messages: returns id (aliased from base_id) and chat_id (aliased from chat_base_id)
 * - get-messages-by-ids: returns base_id and chat_base_id (no aliases)
 *
 * @param {Array} messages - Array of message objects from database
 * @returns {Array} Transformed messages in DMR format
 */
export const transformMessagesForDmr = (messages) => {
  if (!Array.isArray(messages)) {
    return [];
  }

  const transformed = messages.map((message) => {
    // TODO 1664: Double-check if works OK
    // Handle multiple field name variations:
    // - Aliased: id, chat_id (from get-chat-messages)
    // - Snake case: base_id, chat_base_id (from get-messages-by-ids)
    // - Camel case: baseId, chatBaseId (from some endpoints)
    const id = message.id || message.base_id || message.baseId || '';
    const chatId = message.chat_id || message.chat_base_id || message.chatBaseId || '';
    const authorTimestamp = message.author_timestamp || message.authorTimestamp || message.created || '';
    const authorRole = message.author_role || message.authorRole || '';

    return {
      id,
      chatId,
      content: message.content || '',
      authorTimestamp,
      authorRole,
    };
  });

  // TEMPORARY: Remove this console.log after debugging
  console.log('transformMessagesForDmr - transformed messages:', JSON.stringify(transformed, null, 2));

  return transformed;
};

export default transformMessagesForDmr;

