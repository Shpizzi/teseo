import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import ComeFunziona from './pages/ComeFunziona'
import Impatto from './pages/Impatto'
import CommunityPublic from './pages/CommunityPublic'
import Componenti from './pages/Componenti'
import UserLayout from './layouts/UserLayout'
import FablabLayout from './layouts/FablabLayout'
import FablabSlicingLayout from './layouts/FablabSlicingLayout'
import UserDashboard from './pages/user/Dashboard'
import Progetti from './pages/user/Progetti'
import ProgettoDetail from './pages/user/ProgettoDetail'
import NuovaStampa from './pages/user/NuovaStampa'
import Salvati from './pages/user/Salvati'
import Community from './pages/user/Community'
import CommunityDetail from './pages/user/CommunityDetail'
import Produttori from './pages/user/Produttori'
import ProduttoreDetail from './pages/user/ProduttoreDetail'
import Messaggi from './pages/user/Messaggi'
import Profilo from './pages/user/Profilo'
import FablabDashboard from './pages/fablab/Dashboard'
import FablabSlicing from './pages/fablab/Slicing'
import FablabOrdini from './pages/fablab/Ordini'
import FablabOrdineDetail from './pages/fablab/OrdineDetail'
import FablabCoda from './pages/fablab/Coda'
import FablabStampanti from './pages/fablab/Stampanti'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/come-funziona" element={<ComeFunziona />} />
      <Route path="/impatto" element={<Impatto />} />
      <Route path="/community" element={<CommunityPublic />} />
      <Route path="/componenti" element={<Componenti />} />
      <Route path="/app" element={<UserLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="progetti" element={<Progetti />} />
        <Route path="progetti/:id" element={<ProgettoDetail />} />
        <Route path="new" element={<NuovaStampa />} />
        <Route path="salvati" element={<Salvati />} />
        <Route path="community" element={<Community />} />
        <Route path="community/:id" element={<CommunityDetail />} />
        <Route path="produttori" element={<Produttori />} />
        <Route path="produttori/:id" element={<ProduttoreDetail />} />
        <Route path="messages" element={<Messaggi />} />
        <Route path="profile" element={<Profilo />} />
      </Route>
      <Route path="/fablab" element={<FablabLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<FablabDashboard />} />
        <Route path="ordini" element={<FablabOrdini />} />
        <Route path="ordini/:id" element={<FablabOrdineDetail />} />
        <Route path="coda" element={<FablabCoda />} />
        <Route path="stampanti" element={<FablabStampanti />} />
      </Route>
      <Route path="/fablab/slicing" element={<FablabSlicingLayout />}>
        <Route index element={<FablabSlicing />} />
      </Route>
      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  )
}
