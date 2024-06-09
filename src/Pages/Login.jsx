import * as React from 'react';
import { useEffect } from 'react';
import axios from 'axios'
import { useState } from 'react';
import { NavBarr } from '../Components/NavBarr';
import LoginForm from '../Components/LoginForm';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export const Login = () => {
    const [dp, setDp] = useState("")
    const { register } = useParams()
    const nav = useNavigate()

    axios.defaults.withCredentials = true
    const getEmployeeDetails = async () => {
        try {
            const res = await axios.get(`http://localhost:5500/getemployeedp`)
            if (!res.data.Token) {
                localStorage.clear()
                setDp(res.data.DP)
                nav('/')
            }
            else {

                if (JSON.parse(localStorage.getItem('User'))[0].Role === "employee") {
                    toast(`You are already loggedin`)
                    nav('/dashboard')
                }
                else nav('/home')
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getEmployeeDetails()
    }, [])

    return (
        <>
            <NavBarr login={true} dp={dp} />
            <div className="all" style={{ backgroundColor: "black", minHeight: "100vh", height: "auto" }}>
                <LoginForm dp={dp} register={register} />
            </div>
        </>
    )
}