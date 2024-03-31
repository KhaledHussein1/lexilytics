import { useState, useEffect} from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AnalysisResults from "./components/pages/AnalysisResults";
import Home from './components/pages/Home';
import AppBar from './components/navbar/NavBar';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ProfilePage from './components/pages/ProfilePage';
import './App.css';

function App() {
  const [texts, setTexts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentText, setCurrentText] = useState({})

  useEffect(() => {
    fetchTexts();
  }, []);

  const fetchTexts = async () => {
    const response = await fetch("http://127.0.0.1:5000/texts")
    const data = await response.json()
    setTexts(data.texts)
    console.log(data.texts)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentText({})
  }

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true)
  }

  const openEditModal = (text) => {
    if (isModalOpen) return
    setCurrentText(text)
    setIsModalOpen(true)
  }

  const onUpdate = () => {
    closeModal()
    fetchTexts()
  }

  return (
    <Router>
      <AppBar />
      <Routes>
        <Route
          path="/"
          element={<Home texts={texts} openEditModal={openEditModal} openCreateModal={openCreateModal} isModalOpen={isModalOpen} currentText={currentText} onUpdate={onUpdate} closeModal={closeModal}/>}
        />
        <Route path="/analysis-results" element={<AnalysisResults />} />
        {/* Define route for the login page */}
        <Route path="/login" element={<LoginPage />} />
        {/* Define route for the signup page */}
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App
