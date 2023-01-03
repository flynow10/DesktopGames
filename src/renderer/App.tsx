import TabProvider from "@/core/tabs/TabProvider";
import Debug from "./Debug";
import PageDisplay from "./pages/PageDisplay";
import TabBar from "./tabs/TabBar";

export default function App() {
  var debug = null;
  if (true) {
    debug = <Debug />;
  }
  return (
    <TabProvider>
      <TabBar />
      <PageDisplay />
      {debug}
    </TabProvider>
  );
}
