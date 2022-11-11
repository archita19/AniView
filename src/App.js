import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage'
import BrowseAnime from './components/BrowseAnime'
import BrowseManga from './components/BrowseManga'
import MyFavList from './components/MyFavList';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import AddReview from './components/AddReview';
import Reviews from './components/Reviews';
import Item from './components/Item';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './components/theme';
import { GlobalStyles } from './components/theme';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import { useState } from 'react';
import Dashboard from './components/Dashboard';
import DashboardEdit from './components/DashboardEdit';
import SignInAdmin from './components/SignInAdmin';
import PageNotFound from './components/PageNotFound';
import ResetPassword from './components/ResetPassword';
import ForgetPassword from './components/ForgetPassword';

function App() {
  const [theme, changeTheme] = useState(localStorage.getItem('theme') || '');
  const setTheme = data => changeTheme(data);

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <>
        <NavBar theme={theme === 'light' ? "light" : "dark"}/>
        <GlobalStyles/>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path='/browse-animes' element={<BrowseAnime/>}></Route>
          <Route path='/browse-mangas' element={<BrowseManga/>}></Route>
          <Route path='/my-fav-list' element={<MyFavList/>}></Route>
          <Route path='/sign-in' element={<SignIn/>}></Route>
          <Route path='/sign-up' element={<SignUp/>}></Route>
          <Route path='/profile' element={<Profile/>}></Route>
          <Route path='/add-review/:type/:name/:id' element={<AddReview/>}></Route>
          <Route path='/reviews/:type/:name/:id' element={<Reviews/>}></Route>
          <Route path='/:type/:id' element={<Item/>}></Route>
          <Route path='/:type/:id/:userId' element={<Item/>}></Route>
          <Route path='/admin-dashboard' element={<Dashboard/>}></Route>
          <Route path='/admin-dashboard-edit/:type/:itemId' element={<DashboardEdit/>}></Route>
          <Route path='/admin/sign-in' element={<SignInAdmin/>}></Route>
          <Route path='*' element={<PageNotFound/>}></Route>
          <Route path='/reset-password' element={<ResetPassword/>}></Route>
          <Route path='/forget-password' element={<ForgetPassword/>}></Route>
        </Routes>
        <Footer getTheme={setTheme}/>
      </>
    </ThemeProvider>
  );
}

export default App;
