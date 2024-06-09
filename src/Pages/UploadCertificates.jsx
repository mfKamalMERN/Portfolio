import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { NavBarr } from "../Components/NavBarr";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

export const UploadCertificates = () => {
    const nav = useNavigate()
    const [title, setTitle] = useState("")
    const [status, setStatus] = useState(false)
    const [files, setFiles] = useState([])
    const [file, setFile] = useState(null)
    const [certificates, setCertificates] = useState([])
    const [dp, setDp] = useState("")
    const { navbar } = useParams()

    axios.defaults.withCredentials = true
    const tokenChecker = async () => {
        try {
            const res = await axios.get(`http://localhost:5500/getemployeedetails`)
            if (!res.data.Token) {
                localStorage.clear()
                toast("You are not logged In")
                nav('/')
            }
            else {
                if (!navbar) {
                    if (JSON.parse(localStorage.getItem('User'))[0].Role === "recruiter") nav('/home')
                    else {
                        setCertificates(res.data.EmployeeDetails[0].Certificates)
                        setDp(res.data.EmployeeDetails[0].ProfilePic)
                    }
                }
                else {
                    setCertificates(res.data.EmployeeDetails[0].Certificates)
                    setDp(res.data.EmployeeDetails[0].ProfilePic)
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        tokenChecker()
    }, [certificates])

    const submitCertificates = (e) => {
        e.preventDefault()
        if (files.length === 0) toast('No files selected')
        else if (title.trim() === "") toast("Title is missing")
        else {
            const formdata = new FormData()

            for (let file of files) {
                formdata.append('files', file)
            }
            formdata.append('title', title)

            axios.post(`http://localhost:5500/uploadcertificates`, formdata)
                .then(res => {
                    toast(res.data.Msg)
                    setCertificates(res.data.Certificates)
                    setFiles([])
                })
                .catch(er => console.log(er))

        }
    }

    const RemoveDoc = (dpath) => {
        const docpath = dpath
        axios.put(`http://localhost:5500/removecertificate`, { docpath })
            .then(res => toast(res.data.Msg))
            .catch(er => console.log(er))
    }

    const UpdateDoc = async (id) => {

        if (file === null) toast(`File not selected`)
        else {
            const fd = new FormData()
            fd.append('file', file)

            try {
                const res = await axios.put(`http://localhost:5500/updatedoc/${id}`, fd)
                toast(res.data.Msg)
                setStatus(!status)
                setFile(null)

            } catch (error) {
                console.log(error);
            }
        }

    }

    return (
        <>
            <NavBarr dp={dp} />
            <br />
            {
                navbar ?
                    <></>
                    :
                    <form action="" onSubmit={submitCertificates}>
                        <label htmlFor="title">Title</label>
                        <br />
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <br />
                        <br />
                        <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
                        <br />
                        <br />
                        <Button type="submit" variant="contained">Upload</Button>
                    </form>

            }
            <br />
            <br />

            {
                certificates.length === 0 ?
                    <>No Certificates found</>
                    :
                    <>
                        <h2>Certificates/Docs:</h2>
                        {
                            certificates.map((cert) => (
                                <>
                                    <h4>{cert.DocName}</h4>

                                    <Button onClick={() => window.open(cert.DocPath)} variant="contained" style={{ marginRight: "15px", backgroundColor: "darkgreen" }}>View</Button>

                                    {
                                        navbar ?
                                            <></>
                                            :
                                            <>
                                                <Button onClick={() => RemoveDoc(cert.DocPath)} variant="contained" style={{ marginRight: "15px", backgroundColor: "darkred" }}>Remove Doc</Button>
                                                {
                                                    !status ?
                                                        <Button onClick={() => setStatus(!status)} variant="contained">Update Doc</Button>
                                                        :
                                                        <>
                                                            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                                                            <Button onClick={() => UpdateDoc(cert._id)}>Update Doc</Button>
                                                        </>
                                                }
                                            </>
                                    }

                                </>

                            ))
                        }
                    </>
            }
        </>
    )
}