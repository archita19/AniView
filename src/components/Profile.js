import {React, useState, useEffect} from 'react';
import { Row, Container, Col , Button, Form, Card } from 'react-bootstrap';
import '../css/style.css';
import { Link, useNavigate } from 'react-router-dom';
import { db, auth, storage } from '../firebase-config'
import { query, getDocs, collection, where, updateDoc, doc } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function Profile() {
    const [user] = useAuthState(auth);
    const [users, setUser] = useState(['']);
    const[form, setForm] = useState({});
    // const[errors, setErrors] = useState({});
    const setField = (field, value) => {
        setForm({...form,[field]: value})

        // if(!!errors[field])
        //     setErrors({...errors,[field]: null})
    }

    const fetchUser = async () => {
      try {
        const queryRes = query(collection(db, "users"), where("uid", "==", user.uid));
        const docRes = await getDocs(queryRes);
        setUser(docRes.docs.map(doc => ({...doc.data(), id: doc.id})))
      }
      catch(err) {
        console.log(err);
        alert("An error occured while fetching users");
      }
    }

    const navigate = useNavigate();

    useEffect(() => {
        if(user)
            fetchUser()
        else if(!user && !localStorage.getItem('User'))
            navigate('/sign-in', {state: '/profile'})
        else 
            localStorage.setItem('User', user)
          
      }, [user]
    )

    const storeFile = (e) => {
        const file = e.target.files[0];
        console.log(file);
        // console.log(imagesRef);
        if (!file) return;

        const imagesRef = ref(storage, `userImgs/${file.name}`);
        const uploadTask = uploadBytesResumable(imagesRef, file);
        uploadTask.on("state_changed",
        (snapshot) => {
        //   const progress =
        //     Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        //   setProgresspercent(progress);
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setField('img', downloadURL)
          });
        }
      );
    
    }

    const handleSubmit = async(e, id) => {
        e.preventDefault();

        const { userName, gender, dob, bio, img } = form;        
        const newFields = {}

        if(userName !== undefined) 
            newFields.userName = userName
        if(gender !== undefined)
            newFields.gender = gender
        if(dob !== undefined)
            newFields.dob = dob
        if(bio !== undefined)
            newFields.bio = bio
        if(img !== undefined)
            newFields.img = img

        if(Object.keys(newFields).length !== 0) {
            try {
                const userDoc = doc(db, "users", id);
                await updateDoc(userDoc, newFields);
                alert("Profile updated!")
            }
            catch(err) {
                console.log(err.message)
            }
        }

        console.log(newFields)
    }

  return (
    <>
        {/* <NavBar/> */}

        <Container className="my-5">
            <h2 className='text-center mb-5'>Profile</h2>
            <Form>
                <Row>
                    <Col className='d-sm-flex gap-3 mb-3' sm>
                        <div className='mb-2'>
                            <img className="img-thumbnail" src={users[0].img === "" ? process.env.PUBLIC_URL + '/../imgs/profile-avatar.png' : users[0].img} width={100} height={100} alt={users[0].userName}/>
                        </div>
                        <div>
                                {/* <label className="mx-3">Choose file: </label>
                                <input className="d-none" type="file"/>
                                <button className="btn btn-outline-primary">Upload</button> */}
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Control type="file" onChange={(e) => storeFile(e)}/>
                                </Form.Group>
                        </div>
                    </Col>

                    <Col className='mb-3' sm>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Control type="text" defaultValue={users[0].emailId} placeholder="Registered email"  disabled/>
                            <Form.Label>Registered email</Form.Label>
                        </Form.Group>
                        {/* <a href="#forgetpassword">Change Password</a> */}
                    </Col>
                </Row>

                <Row>
                    <Form.Group className="my-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>User Name</Form.Label>
                        <Form.Control type="text" defaultValue={users[0].userName} onChange={(e) => setField('userName', e.target.value)} placeholder="Name" />
                    </Form.Group>
                </Row>
                
                <Row >
                    <Form.Group className="mb-3" controlId="formGridState">
                        <Form.Label>Gender</Form.Label>
                        <select className='form-select w-100' onChange={(e) => setField('gender', e.target.value)}>
                            <option value={users[0].gender}>{users[0].gender}</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </Form.Group>
                </Row>

                <Row >
                    <Form.Group className="mb-3" controlId="duedate">
                        <Form.Label>Birthdate</Form.Label>
                        <Form.Control type="date" defaultValue={users[0].dob} onChange={(e) => setField('dob', e.target.value)} placeholder="Birth date" />
                    </Form.Group>
                </Row>

                <Row >
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control as="textarea" rows={3} defaultValue={users[0].bio} onChange={(e) => setField('bio', e.target.value)} placeholder="Write something about yourself."/>
                    </Form.Group>
                </Row>
                    
                <div className='text-center mt-3'>
                    <Button variant="danger" type="submit" className='w-50' onClick={(e) => {handleSubmit(e,users[0].id)}}>Save</Button>
                </div>
            </Form>
        </Container>

        <Container className='my-5'>
            <div className="d-sm-flex justify-content-center mb-4 text-center">
            <Card className="p-5 w-100 bg border-0" as={Link} to="/my-fav-list">
                <Card.Body>
                    <Card.Title>My FavList<i className="fa-solid fa-angle-right"></i></Card.Title>
                </Card.Body>
            </Card>
            </div>
        </Container>

        {/* <Footer/> */}
    </>
  )
}
