import Layout from "./components/Layout";
import LendingDecisionPage from "./pages/LendingDecisionPage";
import { useEffect } from 'react';

function App() {
  useEffect(() =>{
    document.title = "Lending Decision System";
  }, []);

  return (
    <>
      <Layout >
        <LendingDecisionPage />
      </Layout>
    </>
  );
}

export default App;