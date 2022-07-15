import { Button, Container, Row, Col, Form, FormControl, InputGroup, Table } from 'react-bootstrap'
import React, { useState } from 'react';
import { auth, db, storage } from '../firebase-config'
import { addDoc, collection, query, getDocs, where, deleteDoc, updateDoc, doc } from "firebase/firestore"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function DashboardEdit() {
    const { type, itemId } = useParams();

    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);  

    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState(0);
    const [noOfEpisodes, setNoOfEpisodes] = useState(0);
    const [animationStudio, setAnimationStudio] = useState('');
    const [yearOfRelease, setYearOfRelease] = useState('');
    const [yearOfEnd, setYearOfEnd] = useState('')
    const [storyLine, setStoryLine] = useState('');
    const [contentWarning, setContentWarning] = useState('');
    const [genre, setGenre] = useState('');
    const [soundTrack, setSoundTrack] = useState('');
    const [animePoster, setAnimePoster] = useState('');
    const [animeTrailer, setAnimeTrailer] = useState('');
    const [mangaHeader, setMangaHeader] = useState('');

    const [characters, setCharacters] = useState([]);
    const [charName, setCharName] = useState('');
    const [charImg, setCharImg] = useState('');
    const [charVocal, setCharVocal] = useState('');
    const [addState, setAddState] = useState(false);

    const [staffs, setStaffs] = useState([]);
    const [staffName, setStaffName] = useState('');
    const [staffImg, setStaffImg] = useState('');
    const [staffRole, setStaffRole] = useState('');

    const [itemResult, setItemResult] = useState({});
    const [docItemId, setDocId] = useState('');
    const fetchItemResults = async() => {
        try {
            const queryItemRes = query(collection(db, "animes"), where("animeId", "==", itemId));
            const docRes = await getDocs(queryItemRes);
            const data = docRes.docs[0].data() || null
            const id = docRes.docs[0].id
            // setItemResult(docRes.docs.map(doc => ({...doc.data(), id: doc.id})))
            setItemResult(data)
            setDocId(id)
        }
        catch(err) {
            console.log(err);
        }
    }

    const fetchCharacters = async() => {
        try {
            const queryRes = query(collection(db, "characters"), where("foreignId", "==", itemId));
            const docRes = await getDocs(queryRes);
            setCharacters(docRes.docs.map(doc => ({...doc.data(), id: doc.id})))
        }
        catch(err) {
            console.log(err);
        }
    }

    const fetchStaffs = async() => {
        try {
            const queryRes = query(collection(db, "staffs"), where("foreignId", "==", itemId));
            const docRes = await getDocs(queryRes);
            setStaffs(docRes.docs.map(doc => ({...doc.data(), id: doc.id})))
        }
        catch(err) {
            console.log(err);
        }
    }

    const addCharacter = async() => {
        setAddState(true)

        console.log(characters)

        try {
            await addDoc(collection(db, "characters"), {
                foreignId: itemId,
                img: charImg,
                name: charName,
                vocal: charVocal
            });

            setCharName('')
            setCharImg('')
            setCharVocal('')
        }
        catch(err) {
            console.log(err)
        }
    }

    const addStaff = async() => {
        setAddState(true)
        console.log(staffs)

        try {
            await addDoc(collection(db, "staffs"), {
                foreignId: itemId,
                img: staffImg,
                name: staffName,
                role: staffRole
            });

            setStaffName('')
            setStaffImg('')
            setStaffRole('')
        }
        catch(err) {
            console.log(err)
        }
    }

    const deleteCharacter = async(docId) => {
        try {
            const delCharDoc = doc(db, "characters", docId);
            await deleteDoc(delCharDoc);
        }
        catch(err) {
            console.log(err);
        }
    }

    const deleteStaff = async(docId) => {
        try {
            const delStaffDoc = doc(db, "staffs", docId);
            await deleteDoc(delStaffDoc);
        }
        catch(err) {
            console.log(err);
        }
    }

    const handleSubmit = async(event) => {
        event.preventDefault()
        // const form = event.currentTarget;
        // if (form.checkValidity() === false) {
        //   event.preventDefault();
        //   event.stopPropagation();
          
        // }
        // else {
            
        // }
    
        // setValidated(true);

        const newFields = {}

        if(title !== "")
            newFields.title = title

        if(duration !== 0)
            newFields.duration = duration

        if(animationStudio !== "")
            newFields.animationStudio = animationStudio

        if(contentWarning !== "")
            newFields.contentWarning = contentWarning

        if(mangaHeader !== "")
            newFields.imgHead = mangaHeader

        if(animePoster !== "")
            newFields.imgRef = animePoster

        if(animeTrailer !== "")
            newFields.trailerURL = animeTrailer
            
        if(noOfEpisodes !== 0)
            newFields.noOfEpisodes = noOfEpisodes

        if(genre !== "") {
            newFields.genre = genre
            newFields.genreArray = genre.split(", ")
        }

        if(soundTrack !== "")
            newFields.soundTracks = soundTrack

        if(storyLine !== "")
            newFields.storyLine = storyLine

        if(yearOfRelease !== "") {
            newFields.yearOfRelease = yearOfRelease
            newFields.yor = new Date(yearOfRelease).getTime()
        }

        if(yearOfEnd !== "")
            newFields.yearOfEnd = yearOfEnd

        console.log(newFields)

        if(Object.keys(newFields).length !== 0) {
            try {
                const itemDoc = doc(db, "animes", docItemId);
                await updateDoc(itemDoc, newFields);
            }
            catch(err) {
                console.log(err.message)
            }
        }

        navigate("/admin-dashboard")
    };

    const storeFile = (e, val) => {
        const file = e.target.files[0];
        console.log(file);
        // console.log(imagesRef);
        if (!file) return;

        const imagesRef = ref(storage, `imgs/${file.name}`);
        const uploadTask = uploadBytesResumable(imagesRef, file);
        uploadTask.on("state_changed",
        (snapshot) => {
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            if(val === 'posterImg')
                setAnimePoster(downloadURL)
            else if(val === 'headerImg')
                setMangaHeader(downloadURL)
            else if(val === 'character')
                setCharImg(downloadURL)
            else 
                setStaffImg(downloadURL)
          });
        }
      );
    
    }

    useEffect(() => {
        fetchCharacters()
        fetchStaffs()
        setAddState(true)
    }, [addState, charName, charVocal, charImg, staffName, staffImg, staffRole])
    
    useEffect(() => {
        if(!user)
            navigate('/admin/sign-in')

        fetchCharacters()
        fetchStaffs()
        fetchItemResults()
    }, [])

  return (
    <>
    <Container className='mt-1'> 
        <Form onSubmit={handleSubmit}>
            <p className='fs-2'>Edit {itemResult.title}</p>
            <Row style={{marginRight: '0'}}>
                <Col sm="6">
                    {type === 'anime' &&
                    <Form.Group as={Row} className="mb-3" controlId="formBasicDuration(*)">
                        <Form.Label column sm="6">Duration</Form.Label>
                        <Col sm="6">
                            <Form.Control type="number" name='duration' defaultValue={itemResult.duration} onChange={(e) => setDuration(e.target.value)}/>
                            <FormControl.Feedback type="invalid">Please enter the duration</FormControl.Feedback>
                        </Col>
                    </Form.Group>
                    }

                    <Form.Group as={Row} className="mb-3" controlId="formBasicAnimationStudio(*)">
                        <Form.Label column sm="6">{type === 'anime' ? 'Animation' : 'Publication'} Studio</Form.Label>
                        <Col sm="6">
                            <Form.Control type="text" name='animation' defaultValue={itemResult.animationStudio} onChange={(e) => setAnimationStudio(e.target.value)}/>
                            <FormControl.Feedback type="invalid">Please enter the {type === 'anime' ? 'Animation' : 'Publication'} studio</FormControl.Feedback>
                        </Col>   
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group as={Row} className="mb-3" controlId="formBasicTitle(*)">
                        <Form.Label column sm="6">Title</Form.Label>
                        <Col sm="6">
                            <Form.Control type="text" name='title' defaultValue={itemResult.title} onChange={(e) => setTitle(e.target.value)}/>
                            <FormControl.Feedback type="invalid">Please enter the title</FormControl.Feedback>
                        </Col>
                    </Form.Group>
                        
                    <Form.Group as={Row} className="mb-3" controlId="formGridEpisodes">
                        <Form.Label column sm="6">No. of {type === 'anime' ? 'Episodes' : 'Chapters'}</Form.Label>
                        <Col sm="6">
                            <Form.Control type="number" name='duration' defaultValue={itemResult.noOfEpisodes} onChange={(e) => setNoOfEpisodes(e.target.value)}/>
                            <FormControl.Feedback type="invalid">Please enter the no. of {type === 'anime' ? 'episodes' : 'chapters'}</FormControl.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formGridRelease">
                        <Form.Label column sm="6">Year of Release</Form.Label>
                        <Col sm="6">
                            <Form.Control type="date" name='release' defaultValue={itemResult.yearOfRelease} onChange={(e) => setYearOfRelease(e.target.value)}/>
                            <FormControl.Feedback type="invalid">Please enter the year of release</FormControl.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formGridEnd"> 
                        <Form.Label column sm="6">Year of End</Form.Label>
                        <Col sm="6">
                            <Form.Control type="date" name='end' defaultValue={itemResult.yearOfEnd} onChange={(e) => setYearOfEnd(e.target.value)}/>
                            <FormControl.Feedback type="invalid">Please enter the year of end</FormControl.Feedback>
                        </Col>
                    </Form.Group>        
                </Col>
            </Row>

            <Row>
                <Form.Group as={Row} className="mb-3 pe-0" controlId="formHorizontalStory">
                    <Form.Label column sm="3">Story line</Form.Label>
                    <Col sm="9">
                        <Form.Control as="textarea" rows={4} placeholder="" name='story' defaultValue={itemResult.storyLine} onChange={(e) => setStoryLine(e.target.value)}/>
                        <FormControl.Feedback type="invalid">Please enter the story line</FormControl.Feedback>
                    </Col>
                </Form.Group>

                {type === 'anime' &&
                <Form.Group as={Row} className="mb-3 pe-0" controlId="formHorizontalContent">
                    <Form.Label column sm="3">Content Warning</Form.Label>
                    <Col sm="9">
                        <Form.Control type="text" placeholder="" name='content' defaultValue={itemResult.contentWarning} onChange={(e) => setContentWarning(e.target.value)}/>
                        <FormControl.Feedback type="invalid">Please enter the content warning</FormControl.Feedback>
                    </Col>
                </Form.Group>
                }

                <Form.Group as={Row} className="mb-3 pe-0" controlId="formHorizontalGenre">
                    <Form.Label column sm="3">Genre</Form.Label>
                    <Col sm="9">
                        <Form.Control type="text" placeholder="" name='genre' defaultValue={itemResult.genre} onChange={(e) => setGenre(e.target.value)}/>
                        <FormControl.Feedback type="invalid">Please enter the genre</FormControl.Feedback>
                    </Col>
                </Form.Group>

                {type === 'anime' &&
                <Form.Group as={Row} className="mb-3 pe-0" controlId="Soundtrack">
                    <Form.Label column sm="3">Soundtrack</Form.Label>
                    <Col sm="9">
                        <Form.Control type="text" placeholder="" name='sound' defaultValue={itemResult.soundTracks}  onChange={(e) => setSoundTrack(e.target.value)}/>
                        <FormControl.Feedback type="invalid">Please enter the soundtrack</FormControl.Feedback>
                    </Col>
                </Form.Group>    
                } 
            </Row>
            
            <Row>
                <Form.Group as={Row} controlId="formAnimePoster" className="mb-3 pe-0">
                    <Form.Label column sm="3">Upload {type === 'anime' ? 'Anime' : 'Manga'} Poster</Form.Label>
                    <Col sm="9">
                        <Form.Control type="file" name='animePoster' onChange={(e) => storeFile(e, 'posterImg')}/>
                        <FormControl.Feedback type="invalid">Please upload the anime poster</FormControl.Feedback>
                    </Col>
                </Form.Group>

                {type === 'manga' &&
                    <Form.Group as={Row} controlId="forMangaHeader" className="mb-3 pe-0">
                    <Form.Label column sm="3">Upload Manga Header Image</Form.Label>
                    <Col sm="9">
                        <Form.Control type="file" name='mangaHeader' onChange={(e) => storeFile(e, 'headerImg')}/>
                        <FormControl.Feedback type="invalid">Please upload the anime poster</FormControl.Feedback>
                    </Col>
                </Form.Group>
                }

                {type === 'anime' &&
                <Form.Group as={Row} controlId="formAnimeTrailer" className="mb-3 pe-0">
                    <Form.Label column sm="3" htmlFor="basic-url">Anime Trailer</Form.Label>
                    <Col sm="9">
                        <InputGroup className="mb-3" hasValidation>
                            <InputGroup.Text id="basic-addon3">Enter Link</InputGroup.Text>
                            <FormControl id="basic-url" aria-describedby="basic-addon3" name='animeTrailer' defaultValue={itemResult.trailerURL} onChange={(e) => setAnimeTrailer(e.target.value)}/>
                            <Form.Control.Feedback type="invalid"> Please Enter the link</Form.Control.Feedback>
                        </InputGroup>
                    </Col>
                </Form.Group>
                }
            </Row>

            <Row style={{margin: '0'}}>
                <Table striped bordered className='admin'>
                    <thead>
                        <tr>
                            <th>
                                <Form.Group as={Row} controlId="characterImage" >
                                    <Form.Label column sm="4">Character Image</Form.Label>
                                    <Col sm="">
                                        <Form.Control type="file" onChange={(e) => {storeFile(e, 'character')}}/>
                                        {/* <Form.Control.Feedback>No file chosen</Form.Control.Feedback> */}
                                    </Col>
                                </Form.Group>
                            </th>
                            <th>
                                <Form.Control type="text" placeholder="Character Title" onChange={(e) => setCharName(e.target.value)}/>
                                <Form.Control.Feedback type="invalid"> Please Enter the Character Title</Form.Control.Feedback>
                            </th>
                            {type === 'anime' && 
                                <th>
                                    <Form.Control type="text" placeholder="Character Vocal" onChange={(e) => setCharVocal(e.target.value)}/>
                                    <Form.Control.Feedback type="invalid"> Please Enter the Character Vocal</Form.Control.Feedback>
                                </th>
                            }
                            <th><Button variant="outline-danger" onClick={addCharacter}>ADD</Button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            characters && characters.map((ch) => {
                                return (
                                <tr>
                                    <td><img src={ch.img} width={40} height={40}/></td>
                                    <td>{ch.name}</td>
                                    {type === 'anime' && <td>{ch.vocal}</td>}
                                    <td>
                                        <Button variant="outline-danger" className="border-0" onClick={() => {deleteCharacter(ch.id); setAddState(false)}}>
                                            <i class="fa-solid fa-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            )
                            }

                            )
                        }
                    
                    </tbody>
                </Table>

                <Table striped bordered className='admin'>
                    <thead>
                        <tr>
                            <th>
                                <Form.Group as={Row} controlId="staffImage" >
                                    <Form.Label column sm="3">Staff Image</Form.Label>
                                    <Col sm="9">
                                        <Form.Control type="file" onChange={(e) => storeFile(e, 'staff')}/>
                                    </Col>
                                </Form.Group>
                            </th>
                            
                            <th><Form.Control type="text" placeholder="Staff Title" onChange={(e) => setStaffName(e.target.value)}/>
                                <Form.Control.Feedback type="invalid"> Please Enter the Staff Title</Form.Control.Feedback>
                            </th>

                            <th><Form.Control type="text" placeholder="Staff Role" onChange={(e) => setStaffRole(e.target.value)}/>
                                <Form.Control.Feedback type="invalid"> Please Enter the Staff Role</Form.Control.Feedback>
                            </th>

                            <th><Button variant="outline-danger" onClick={addStaff}>ADD</Button></th>
                        </tr>
                    </thead>
                    <tbody>  
                    {
                            staffs && staffs.map((st) => {
                                return (
                                <tr>
                                    <td><img src={st.img} width={40} height={40}/></td>
                                    <td>{st.name}</td>
                                    <td>{st.role}</td>
                                    <td>
                                        <Button variant="outline-danger" className="border-0" onClick={() => {deleteStaff(st.id); setAddState(false)}}>
                                            <i class="fa-solid fa-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            )
                            }

                            )
                        }                          
                    </tbody>
                </Table>
            </Row>
            <Button type="submit" className="float-end mb-3 px-4" variant='danger'>Save</Button>
        </Form>
    </Container>
    </>
  )
}
