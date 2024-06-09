import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import { Login } from './Pages/Login';
import { Home } from './Pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dashboard } from './Pages/Dashboard';
import { UploadResume } from './Pages/UploadResume';
import { UploadCertificates } from './Pages/UploadCertificates';
import { Marksheets } from './Pages/Marksheets';

function App() {

  const router = createBrowserRouter([
    { path: '/', element: <Login /> },
    { path: '/home', element: <Home /> },
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/uploadresume', element: <UploadResume /> },
    { path: '/uploadcertificates', element: <UploadCertificates /> },
    { path: '/uploadcertificates/:navbar', element: <UploadCertificates /> },
    { path: '/:register', element: <Login /> },
    { path: '/allmarksheets', element: <Marksheets /> },
  ])

  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}

export default App;
