import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { NavBarr } from "../Components/NavBarr"
import { Button } from "@mui/material"
import { toast } from "react-toastify"

export const Dashboard = () => {
    const nav = useNavigate()
    const [employee, setEmployee] = useState([])
    const [status, setStatus] = useState(false)
    const [qstatus, setQstatus] = useState(false)
    const [udegree, setUdegree] = useState(false)
    const [skills, setSkills] = useState("")

    const [file, setFile] = useState(null)
    const [degreename, setDegreename] = useState("")
    const [doc, setDoc] = useState("")
    const [percentage, setPercentage] = useState("")
    const [did, setDid] = useState("")

    axios.defaults.withCredentials = true
    const tokenChecker = () => {
        axios.get(`https://portfolio-backend-fkgh.onrender.com/getemployeedetails`)
            .then(res => {
                if (!res.data.Token) {
                    localStorage.clear()
                    toast("You are not Logged In")
                    nav('/')
                }
                else setEmployee(res.data.EmployeeDetails)
            })
            .catch(er => console.log(er))
    }

    useEffect(() => {
        tokenChecker()
    })

    const viewMarksheet = (path) => window.open(path)

    const updatestatus = () => {
        setStatus(!status)
        setQstatus(false)
        setSkills(employee[0].Skills)
    }

    const UpdateSkill = async () => {
        if (skills.trim() === "") toast("Skillset is empty")
        else {
            axios.put(`https://portfolio-backend-fkgh.onrender.com/addskills`, { skills })
                .then(res => {
                    toast(res.data.Msg)
                    setSkills("")
                    setStatus(!status)
                })
                .catch(er => console.log(er))
        }
    }

    const UpdateQualStatus = () => {
        setQstatus(!qstatus)
        setStatus(false)
        setDegreename("")
        setPercentage("")
        setDoc(null)
        setFile(null)
        setUdegree(false)

    }

    const updateDegreestat = (degreeid) => {
        setStatus(false)
        setQstatus(true)
        setUdegree(true)

        axios.get(`https://portfolio-backend-fkgh.onrender.com/getdegree/${degreeid}`)
            .then(res => {
                const tqual = res.data.TargetQual
                setDegreename(tqual.Degree)
                setDoc(tqual.CompletedOn)
                setPercentage(tqual.Percentage)
                setDid(degreeid)
            })
            .catch(er => console.log(er))
    }

    const submitQualification = async () => {
        if (file === null) toast("No file selected")
        else {

            const formdata = new FormData()
            formdata.append('file', file)
            formdata.append('degreename', degreename)
            formdata.append('doc', doc)
            formdata.append('percentage', percentage)

            try {
                const res = await axios.post(`https://portfolio-backend-fkgh.onrender.com/addqualification`, formdata)

                if (res.data.ValidationError) {
                    res.data.ActError.map((e) => toast(e.msg))
                }

                else {
                    toast(res.data.Msg)
                    setQstatus(!qstatus)
                    setDegreename("")
                    setDoc(null)
                    setPercentage("")
                    setFile(null)
                    setStatus(false)
                }

            } catch (error) {
                console.log(error);
            }
        }
    }

    const RemoveDegree = (degreeid) => {
        if (window.confirm("Remove this degree?")) {
            axios.delete(`https://portfolio-backend-fkgh.onrender.com/removedegree/${degreeid}`)
                .then(res => toast(res.data.Msg))
                .catch(er => console.log(er))
        }
    }

    const updateDegree = async (DID) => {
        if (file === null) toast("No file selected")
        else {
            const formdata = new FormData()
            formdata.append('file', file)
            formdata.append('degreename', degreename)
            formdata.append('percentage', percentage)
            formdata.append('doc', doc)

            try {
                const res = await axios.put(`https://portfolio-backend-fkgh.onrender.com/updatedegree/${DID}`, formdata)

                if (res.data.ValidationError) {
                    res.data.ActError.map((e) => toast(e.msg))
                }

                else {
                    toast(res.data.Msg)
                    setQstatus(false)
                }

            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <>
            {employee.length === 0 ?
                <>Loading...</>
                :
                <>
                    <NavBarr dp={employee[0].ProfilePic} />
                    <div className="box">
                        <h3>Hi {employee[0].Name}😄</h3>
                        <h2>Your Details Below:</h2>
                        {
                            employee.map((emp) => (
                                <div className="tbl" style={{ display: "flex", justifyContent: "center" }}>

                                    <table border={1} style={{ marginTop: "5%" }}>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Age</th>
                                                <th>D.O.B</th>
                                                <th>Gender</th>
                                                <th>Marital Status</th>
                                                <th>Nationality</th>
                                                <th colSpan={3}>Experience</th>
                                                <th>Contact</th>
                                                <th>Email</th>
                                                <th>Skills</th>
                                                <th colSpan={emp.Qualification.length}>Qualification</th>
                                                <th>Avatar</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            <tr>
                                                <td>{emp.Name}</td>
                                                <td>{emp.Age}</td>
                                                <td>{emp.DOB}</td>
                                                <td>{emp.Gender}</td>
                                                <td>{emp.MaritalStatus}</td>
                                                <td>{emp.Nationality}</td>
                                                <td><p>Years: {emp.Experience.Years}</p></td>
                                                <td><p>Months: {emp.Experience.Months}</p></td>
                                                <td><p>Total Years: {emp.Experience.TotalExperience}</p></td>
                                                <td>{emp.Contact}</td>
                                                <td>{emp.Email}</td>
                                                <td>{emp.Skills}</td>

                                                {/* <td> */}
                                                {emp.Qualification.map((qual) => (

                                                    <td>
                                                        Degree: {qual.Degree}, Completed On:{qual.CompletedOn}, Percentage: {qual.Percentage}<button onClick={() => viewMarksheet(qual.Marksheet)}>View Marksheet</button>
                                                        <button onClick={() => RemoveDegree(qual._id)}>➖ </button>
                                                        <button onClick={() => updateDegreestat(qual._id)}>✏️</button>
                                                    </td>

                                                ))}
                                                {/* </td> */}

                                                <td><img src={emp.ProfilePic} alt="" style={{ width: "60px", borderRadius: "100px" }} /></td>

                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ))
                        }
                        {/* <br /> */}
                        <div className="brngroug" style={{ display: "flex", justifyContent: "center" }}>

                            <div className="btns" style={{ display: "flex", justifyContent: "space-evenly", width: "60vw" }}>

                                <Button onClick={() => nav(`/uploadresume`)} variant="contained">Update Resume</Button>

                                <Button onClick={() => nav('/uploadcertificates')} variant="contained">Upload Certificates</Button>

                                <Button onClick={() => updatestatus()} variant="contained">Update Skills</Button>

                                <Button onClick={() => UpdateQualStatus()} variant="contained" style={{ backgroundColor: "darkgreen" }}>➕ Qualification</Button>

                            </div>

                        </div>

                        {
                            !status ?
                                <></>
                                :
                                <div className="skill" style={{ border: "1px solid black", width: "15vw", marginLeft: "42%", marginTop: "3%" }}>

                                    <label htmlFor="skills">Enter Skills</label>
                                    <br />
                                    <input type="text" id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} />
                                    <br />
                                    <br />
                                    <Button onClick={UpdateSkill} variant="contained">Update Skills</Button>
                                </div>

                        }

                        {
                            !qstatus ?
                                <></>
                                :
                                <div className="skill" style={{ border: "1px solid black", width: "15vw", marginLeft: "42%", marginTop: "3%" }}>

                                    <label htmlFor="degreename">Degree Name</label>
                                    <br />
                                    <input type="text" id="degreename" value={degreename} onChange={(e) => setDegreename(e.target.value)} />

                                    <br />
                                    <br />

                                    <label htmlFor="doc">Date Of Completion</label>
                                    <br />
                                    <input type="date" id="doc" value={doc} onChange={(e) => setDoc(e.target.value)} />

                                    <br />
                                    <br />

                                    <label htmlFor="%">Percentage/CGPA</label>
                                    <br />
                                    <input type="text" id="%" value={percentage} onChange={(e) => setPercentage(e.target.value)} />

                                    <br />
                                    <br />

                                    <label htmlFor="marksheet">Marksheet</label>
                                    <br />
                                    <input type="file" id="marksheet" onChange={(e) => setFile(e.target.files[0])} />

                                    <br />
                                    <br />
                                    {
                                        udegree ?
                                            <button onClick={() => updateDegree(did)}>✏️Degree</button>
                                            :
                                            <button onClick={submitQualification}>➕ Qualification</button>

                                    }
                                </div>
                        }

                    </div>
                </>
            }
        </>
    )
}