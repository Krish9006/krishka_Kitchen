import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Pages/Home'
import UserLogin from '../Pages/UserLogin'
import UserRegister from '../Pages/UserRegister'
import PartnerRegister from '../Pages/PartnerRegister'
import PartnerLogin from '../Pages/PartnerLogin'
import PartnerProfile from '../Pages/PartnerProfile'
import PartnerOrders from '../Pages/PartnerOrders'
import UserProfile from '../Pages/UserProfile'
import AddFood from '../Pages/AddFood'

const Approutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<UserLogin />} />
            <Route path='/register' element={<UserRegister />} />
            <Route path='/food-partner/register' element={<PartnerRegister />} />
            <Route path='/food-partner/login' element={<PartnerLogin />} />
            <Route path='/partner/profile' element={<PartnerProfile />} />
            <Route path='/partner/orders' element={<PartnerOrders />} />
            <Route path='/profile' element={<UserProfile />} />
            <Route path='/add-food' element={<AddFood />} />
        </Routes>
    )
}

export default Approutes