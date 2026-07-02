import { HomePageClient } from "./home-page-client";
import { Providers } from "./providers";
import { ContextProvider } from "./Context";

export default function Home() {
  return (
    <Providers>
      <ContextProvider>
        <HomePageClient />
      </ContextProvider>
    </Providers>
  );
}
