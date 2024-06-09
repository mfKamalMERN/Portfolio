import axios from "axios"
import { NavBarr } from "../Components/NavBarr"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@mui/material"
import { toast } from "react-toastify"

export const UploadResume = () => {
    const nav = useNavigate()
    const [file, setFile] = useState(null)
    const [dp, setDp] = useState("")
    const [resumepath, setResumepath] = useState("")
    const [employee, setEmployee] = useState([])

    axios.defaults.withCredentials = true
    const tokenChecker = async () => {
        try {
            const res = await axios.get(`http://localhost:5500/getemployeedetails`)
            if (!res.data.Token) {
                localStorage.clear()
                nav('/')
            }
            else {
                setEmployee(res.data.EmployeeDetails)
                setDp(res.data.EmployeeDetails[0].ProfilePic)
                setResumepath(res.data.EmployeeDetails[0].Resume.DocPath)
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        tokenChecker()
    })

    const UploadCV = (e) => {
        e.preventDefault()
        if (file === null) toast("No file selected")
        else {

            const formdata = new FormData()

            formdata.append('file', file)
            formdata.append('title', 'Resume')

            axios.put(`http://localhost:5500/uploadresume`, formdata)
                .then(res => {
                    toast(res.data.Msg)
                    setResumepath(res.data.ResumePath)
                    setFile(null)
                })
                .catch(er => console.log(er))
        }
    }

    const OpenResume = () => {
        if (resumepath === "") toast("No Resume file Found")
        else window.open(resumepath)
    }

    const RemoveResume = () => {
        axios.delete(`http://localhost:5500/removeresume`)
            .then(res => toast(res.data.Msg))
            .catch(er => console.log(er))
    }

    return (
        <>
            <NavBarr dp={dp} />
            <br />
            {
                employee.length === 0 ?
                    <>
                    </>
                    :
                    <>
                        <form action="" onSubmit={UploadCV}>
                            {
                                file === null ?
                                    <h4>Select Resume file</h4>
                                    :
                                    <></>
                            }
                            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                            <br />
                            <br />
                            <Button type="submit" variant="contained">Upload Resume</Button>
                        </form>

                        <br />
                        <br />
                        {
                            !resumepath ?
                                <></>
                                :

                                <>
                                    <Button onClick={OpenResume} variant="contained" style={{ marginRight: "15px", backgroundColor: "darkgreen" }}>View Resume</Button>
                                    <Button onClick={RemoveResume} variant="contained" style={{ backgroundColor: "darkred" }}>Remove Resume</Button>

                                </>
                        }
                    </>
            }



        </>
    )
}