import store from "@/redux/store";
import "@/styles/globals.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";

export default function App({ Component, pageProps }: AppProps) {
  const client = new ApolloClient({
    uri: "http://slik-update-scheduler-monitor-dev.apps.ocp4dev.muf.co.id/",
    cache: new InMemoryCache({'resultCaching': }),
  });

  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </Provider>
  );
}
