import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { addMessageMutation, messageAddedSubscription, messagesQuery } from './queries';

export function useAddMessage() {
  const [mutate] = useMutation(addMessageMutation);

  const addMessage = async (text) => {
    const { data: { message } } = await mutate({
      variables: { text },
      // before the use of subscriptions
      // update: (cache, { data: { message }}) => {
      //   const newMessage = message;
      //   cache.updateQuery({ query: messagesQuery }, ({ messages }) => {
      //     return { messages: [...messages, newMessage ] };
      //   });
      // },
    });
    return message;
  };

  return { addMessage };
}

export function useMessages() {
  const { data } = useQuery(messagesQuery);
  useSubscription(messageAddedSubscription, {
    onData: ({ client: { cache }, data: { data: {message} } }) => {
      console.log('[onData]', message);
      cache.updateQuery({ query: messagesQuery }, ({ messages }) => {
        return { messages: [...messages, message ] };
      });
    },
  });
  return {
    messages: data?.messages ?? [],
  };
}
