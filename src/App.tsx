import { Navigate, Route, Routes } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';
import './App.css';
import MainLayout from './main_layout';

function App() {
    return (
        <Fragment>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route path="/" element={<Navigate to="/main" />} />
                    <Route path="/main" element={<></>} />
                    <Route path="/projects" element={<></>} />
                    <Route path="/web-games" element={<></>} />
                    <Route path="/info" element={<></>} />
                </Route>
                <Route path="*" element={<Navigate to="/main" />} />
            </Routes>
        </Fragment>
    );
}

export default App
