import { RouterProvider } from 'react-router-dom';
import { AppProviders } from '../src/app/providers';
import { router } from '../src/routes/index';

 function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;