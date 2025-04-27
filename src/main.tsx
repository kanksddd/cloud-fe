import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider} from 'react-router'
import Home from './pages/Home.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import UploadSound from './pages/UploadSound.tsx'
import MySound from './pages/MySound.tsx'
import CreateSound from './pages/CreateSound.tsx'
import Login from './pages/Login.tsx'
import { VolumeProvider } from './components/ui/VolumeContext.tsx'


const router = createBrowserRouter([
  {path:'/', element:<App/>},
  {path:'/Home', element:<Home/>},
  {path:'/UploadSound', element:<UploadSound/>},
  {path:'/MySound', element:<MySound/>},
  {path:'/CreateSound', element:<CreateSound/>},
  {path:'/Login', element:<Login/>},
  {path:'*', element:<NotFoundPage/>}
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <VolumeProvider>
  <RouterProvider router={router}/>
  </VolumeProvider>
  </StrictMode>,
)
