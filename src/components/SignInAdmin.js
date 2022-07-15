import { React, useState } from 'react'
import { Container, Form, Button, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from "firebase/auth"
import { db, auth } from '../firebase-config'
import { query, getDocs, collection, where } from "firebase/firestore";
import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';

export default function SignInAdmin() {
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[authError, setAuthError] = useState("");
    const [user] = useAuthState(auth);
    const [users, setUser] = useState([])

    const fetchUser = async () => {
        try {
          const queryRes = query(collection(db, "users"), where("isAdmin", "==", true));
          const docRes = await getDocs(queryRes);
          setUser(docRes.docs.map(doc => ({...doc.data(), id: doc.id})))
        }
        catch(err) {
          console.log(err);
          alert("An error occured while fetching users");
        }
    }

    useEffect(() => {
        fetchUser()

        // console.log(users[0].isAdmin)
        // if(user && users && users[0].isAdmin === true)
        //     navigate('/admin-dashboard')
        // navigate('/admin-dashboard')

    }, [])

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(users[0].emailId === email) {
                await signInWithEmailAndPassword(auth, email, password);
                navigate('/admin-dashboard');
            }
            else {
                navigate('/admin/sign-in');
                setAuthError({message: "You are not an admin!"})
            }
        }
        catch(err) {
            console.log(err);
            setAuthError(err);
        }
    }

  return (
    <>
        <Container className="my-5 sign-in" style={{ maxWidth: "50%" }}>
            {authError && <Alert variant='danger'>{authError.message}</Alert>}
            <h2 className='text-center mb-5'>Admin Sign In</h2>
            <Form>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => {setEmail(e.target.value)}} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => {setPassword(e.target.value)}} required />
                </Form.Group>
                <Button variant="danger" type="submit"  onClick={handleSubmit} style={{display: "block", width: "100%", marginBottom: "1rem"}}>Sign In</Button>
            </Form>
        </Container>
    </>
  )
}
