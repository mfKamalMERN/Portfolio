import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginForm({ dp, register }) {
    const nav = useNavigate()
    const [email, setEmail] = useState("")
    const [remail, setRemail] = useState("")
    const [name, setName] = useState("")
    const [rpwd, setRpwd] = useState("")
    const [rcontact, setRcintact] = useState("")
    const [rorg, setRorg] = useState("")
    const [workmode, setWorkmode] = useState("")
    const [password, setPassword] = useState("")
    const [be, setBe] = useState([])

    const submit = (e) => {
        e.preventDefault()

        axios.post(`https://portfolio-backend-fkgh.onrender.com/login`, { email, password })
            .then(res => {
                if (res.data.ValidationError) {
                    setBe(res.data.ActError)
                    be.map((e) => (
                        toast(e.msg)
                    ))
                }
                else {
                    setBe([])
                    if (res.data.LoggedIn) {
                        toast(res.data.Msg)
                        if (res.data.Role === 'recruiter') {
                            localStorage.setItem('User', JSON.stringify(res.data.Recruiter))
                            nav('/home')
                        }
                        else {
                            localStorage.setItem('User', JSON.stringify(res.data.Emp))
                            nav('/dashboard')
                        }
                    }
                    else {
                        if (res.data.Msg === "Incorrect Password") toast(res.data.Msg)
                        else toast(res.data.Msg)
                    }
                }

            })
            .catch(er => console.log(er))
    }

    const registerAsrecruiter = (e) => {
        e.preventDefault()
        axios.post(`https://portfolio-backend-fkgh.onrender.com/registerasrecruiter`, { name, rcontact, remail, rpwd, rorg, workmode })
            .then(res => {
                toast(res.data.Msg)
            })
            .catch(er => console.log(er))
    }

    return (
        <>
            <div className="all" style={{ border: "1px solid wheat", height: "100vh", display: "flex", justifyContent: "space-evenly" }}>

                <div className="box1" style={{ height: "25rem", width: "25rem", marginTop: "5rem" }}>
                    <img src={dp} alt="" style={{ width: "25rem", borderRadius: "110px" }} />
                </div>

                <div className="box2" style={{ border: "1px solid wheat", height: "35rem", width: "25rem", marginTop: "5rem", color: "wheat", borderRadius: "25px" }}>

                    {
                        !register ?
                            <>
                                <form action="" onSubmit={submit} style={{ marginTop: "15px" }}>

                                    <label htmlFor="email">
                                        {
                                            email.trim() === "" ?
                                                <>Email</>
                                                :
                                                <>{email}</>
                                        }
                                    </label>
                                    <br />

                                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <br />
                                    <br />

                                    <label htmlFor="pwd">Password</label>
                                    <br />
                                    <input type="password" id="pwd" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <br />
                                    <br />

                                    <button type="submit">Login</button>

                                </form>
                                <br />
                                <hr />
                                <h3>New User?</h3>
                                <button onClick={() => nav(`/${true}`)}>Register as Recruiter</button>
                            </>
                            :
                            <>
                                <form action="">

                                    <label htmlFor="name">Name</label>
                                    <br />
                                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                    <br />
                                    <br />

                                    <label htmlFor="contact">Contact</label>
                                    <br />
                                    <input type="text" id="contact" value={rcontact} onChange={(e) => setRcintact(e.target.value)} />
                                    <br />
                                    <br />

                                    <label htmlFor="remail">Email</label>
                                    <br />
                                    <input type="text" id="remail" value={remail} onChange={(e) => setRemail(e.target.value)} />
                                    <br />
                                    <br />

                                    <label htmlFor="rpassword">Password</label>
                                    <br />
                                    <input type="rpassword" value={rpwd} onChange={(e) => setRpwd(e.target.value)} />
                                    <br />
                                    <br />
                                    <label htmlFor="orgname">Organization Name</label>
                                    <br />

                                    <input type="text" id="orgname" value={rorg} onChange={(e) => setRorg(e.target.value)} />
                                    <br />
                                    <br />

                                    <label htmlFor="workmode">Workmode(Hybrid/Remote/WFO)</label>
                                    <br />
                                    <input type="text" id="workmode" value={workmode} onChange={(e) => setWorkmode(e.target.value)} />
                                    <br />
                                    <br />

                                    <button onClick={registerAsrecruiter} type="submit">Register as Recruiter</button>

                                </form>
                                <br />
                                <hr />
                                <h3>Already Registered?</h3>
                                <button onClick={() => nav(`/`)}>Login</button>
                            </>
                    }

                </div>
            </div>
        </>
    );
}
