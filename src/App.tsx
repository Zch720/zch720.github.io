import { Navigate, Route, Routes } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';
import './App.css';
import MainLayout from './main_layout';
import MazeGame from './pages/web_games/games/maze/maze';
import WebGames from './pages/web_games/web_games';

function App() {
    return (
        <Fragment>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route path="/" element={<Navigate to="/main" />} />
                    <Route path="/main" element={<></>} />
                    <Route path="/projects" element={<></>} />
                    <Route path="/web-games" element={<WebGames />} />
                    <Route path="/web-games/maze" element={<MazeGame />} />
                    <Route path="/info" element={<></>} />
                </Route>
                <Route path="*" element={<Navigate to="/main" />} />
            </Routes>
        </Fragment>
    );
}

export default App
