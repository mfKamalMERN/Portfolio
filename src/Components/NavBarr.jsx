import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const NavBarr = ({ dp, login }) => {
    const [value, setValue] = React.useState(0);
    const nav = useNavigate()

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const LogOut = () => {
        if (window.confirm("Log Out?")) {
            localStorage.clear()
            axios.get(`https://portfolio-backend-fkgh.onrender.com/logout`)
                .then(res => {
                    nav('/')
                    toast(res.data.Msg)
                })
                .catch(err => console.log(err))
        }
    }

    const OpenResume = () => {
        axios.get(`https://portfolio-backend-fkgh.onrender.com/getresume`)
            .then(res => {
                if (res.data.ResumePath === "") toast(`No Resume Found`)
                else window.open(res.data.ResumePath)
            })
            .catch(er => console.log(er))
    }

    const Navv = () => {
        if (JSON.parse(localStorage.getItem('User'))[0].Role === "employee") nav('/dashboard')
        else nav('/home')
    }

    return (
        <>
            <Box sx={{ width: '100%', bgcolor: 'darkred' }}>
                {
                    login ?
                        <div className="lnavbar" style={{ display: "flex", justifyContent: "center", flexDirection: "row-reverse" }}>
                            <Avatar alt="Remy Sharp" src={dp} />
                            <Tab label="Portfolio: MD FAISAL KAMAL" style={{ color: 'wheat' }} />
                        </div>

                        :
                        <Tabs value={value} onChange={handleChange} centered style={{ display: "flex", justifyContent: "center", flexDirection: "row-reverse" }}>

                            <Tab onClick={OpenResume} label="Resume" style={{ color: 'wheat' }} />
                            <Tab onClick={() => Navv()} label="🏠" style={{ color: 'wheat' }} />
                            <Tab onClick={() => nav(`/uploadcertificates/${true}`)} label="Certificates" style={{ color: 'wheat' }} />

                            <Tab onClick={() => nav('/allmarksheets')} label="Marksheets" style={{ color: 'wheat' }} />

                            <div className="profile" style={{ display: "flex" }}>
                                <Tab onClick={() => Navv()} label="Md Faisal Kamal" style={{ color: 'wheat' }} />
                                <Avatar alt="Remy Sharp" src={dp} />
                            </div>
                            <Tab onClick={LogOut} label="Sign Out" style={{ color: 'wheat' }} />
                        </Tabs>
                }
            </Box>
        </>
    )
}