import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink,
  useQuery,
  useMutation,
  useSubscription, gql
} from "@apollo/client";
import { getMainDefinition } from '@apollo/client/utilities';
import { useEffect, useState } from "react";


import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost/graphql',
    lazy: true,
    reconnect: true,
  }),
);




const httpLink = new HttpLink({
  uri: 'http://localhost/graphql',
});


const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});


// GraphQL queries and mutations
const GET_MESSAGES = gql`
  query {
    messages {
      id
      content
      createdAt
      user {
        username
      }
    }
  }
`;

const MESSAGE_ADDED = gql`
  subscription {
    messageAdded {
      id
      content
      user {
        username
      }
    }
  }
`;


const POST_MESSAGE = gql`
  mutation($userId: String!, $content: String!) {
    createMessage(input: { userId: $userId, content: $content }) {
      id
      content
      createdAt
      user {
        username
      }
    }
  }
`;

// Main app component
function App() {
  const [state, setState] = useState({
    messages: [],
    userId: '1',
    content: '',
  });

  // Fetch initial messages
  const { loading, error } = useQuery(GET_MESSAGES, {
    onCompleted: data => setState(prev => ({ ...prev, messages: data.messages })),
  });

  // Subscribe to new messages
  const { data: newMessageData } = useSubscription(MESSAGE_ADDED);

  useEffect(() => {
    if (newMessageData) {
      console.log('newMessageData', newMessageData);
      const newMessage = newMessageData.messageAdded;
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage],
      }));
    }
  }, [newMessageData]);

  const [postMessage] = useMutation(POST_MESSAGE);

  const onSend = () => {
    if (state.content.length > 0) {
      postMessage({
        variables: {
          userId: state.userId,
          content: state.content,
        },
      });
      setState(prev => ({
        ...prev,
        content: '',
      }));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="App">
      {state.messages.map(({ id, user, content }) => (
        <div key={id}>
          <h3>{user.username}</h3>
          <p>{content}</p>
        </div>
      ))}
      <textarea
        value={state.content}
        onChange={(evt) => setState({
          ...state,
          content: evt.target.value,
        })}
      />
      <button onClick={onSend}>Send</button>
    </div>
  );
}

function ApolloApp() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}

export default ApolloApp;
