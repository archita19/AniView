import { Button, Container, Row, Col, Form, FormControl, InputGroup, Table } from 'react-bootstrap'
import React, { useState } from 'react';
import { auth, db, storage } from '../firebase-config'
import { addDoc, collection, query, getDocs, where, deleteDoc, doc } from "firebase/firestore"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardAdd(){
    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);  

    const [formType, setFormType] = useState('Anime');

    const [itemId, setItemId] = useState(String(new Date().getTime()));
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

    const [characters, setCharacters] = useState(['']);
    const [charName, setCharName] = useState('');
    const [charImg, setCharImg] = useState('');
    const [charVocal, setCharVocal] = useState('');
    const [addState, setAddState] = useState(false);

    const [staffs, setStaffs] = useState(['']);
    const [staffName, setStaffName] = useState('');
    const [staffImg, setStaffImg] = useState('');
    const [staffRole, setStaffRole] = useState('');

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

    // const updateCharacter = async(docId) => {
    //     try {
    //         const charDoc = doc(db, "characters", docId);
    //         await updateDoc(charDoc, {
    //             img: charImg,
    //             name: charName,
    //             vocal: charVocal
    //         });
    //     }
    //     catch(err) {
    //         console.log(err.message)
    //     }
    // }

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

    const changeFormType = async(e) => {
        setFormType(e.target.value);
        // setItemId(new Date().getTime());
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

        try {
            await addDoc(collection(db, "animes"), {
                addedDate: Number(new Date().getTime()),
                animeId: itemId,
                animationStudio: animationStudio,
                contentWarning: contentWarning,
                dropped: 0,
                genre: genre,
                genreArray: genre.split(", "),
                imgRef: animePoster,
                itemType: formType.toLowerCase(),
                noOfEpisodes: noOfEpisodes,
                duration: duration,
                rating: 0,
                ratingCount: 0,
                soundTracks: soundTrack,
                storyLine: storyLine,
                title: title,
                trailerURL: animeTrailer,
                wantToWatch: 0,
                watching: 0,
                watched: 0,
                reading: 0,
                wantToRead: 0,
                yearOfEnd: yearOfEnd,
                yearOfRelease: yearOfRelease,
                yor: new Date(yearOfRelease).getTime(),
                imgHead: mangaHeader
            });

            window.location.reload(false);
            // navigate('/admin-dashboard')
        }
        catch(err) {
            console.log(err);
        }
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
        //   const progress =
        //     Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        //   setProgresspercent(progress);
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

    // const [docId, setDocId] = useState('');

    // const [itemId, setItemId] = useState(new Date().getTime());
    // useEffect(() => {

    //     const addItem = async() => {
    //         try{
    //             const {id} = await addDoc(collection(db, "animes"), {
    //                 animeId: itemId
    //             });
    //             setDocId(id)
    //         }
    //         catch(err) {
    //             console.log(err)
    //         }
    //     }

    //     addItem();

    // }, [])


    useEffect(() => {
        fetchCharacters()
        fetchStaffs()
        setAddState(true)
    }, [addState, charName, charVocal, charImg, staffName, staffImg, staffRole])

    const [user] = useAuthState(auth);

    // useEffect(() => {
    //     if(!user)
    //         navigate('/admin/sign-in')
    // }, [])
    

    return(
        <>
        <Container className='m-0'> 
            <Form onSubmit={handleSubmit}>
                <Row style={{marginRight: '0'}}>
                    <Col sm="6">
                        <Form.Group as={Row} className="mb-3" controlId="formGridAdd">
                            <Form.Label column sm="6">Add</Form.Label>
                            <Col sm="6">
                                <Form.Select defaultValue="Choose..." className='w-100' onChange={changeFormType}>
                                    <option>Anime</option>
                                    <option>Manga</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>

                        {/* <Form.Group as={Row} className="mb-3" controlId="formGridType">
                            <Form.Label column sm="3">Type</Form.Label>
                            <Col sm="5">
                                <Form.Select defaultValue="Choose...">
                                    <option>Movie</option>
                                    <option>Tv Series</option>
                                </Form.Select>
                            </Col>   
                        </Form.Group> */}

                        {formType === 'Anime' &&
                        <Form.Group as={Row} className="mb-3" controlId="formBasicDuration(*)">
                            <Form.Label column sm="6">Duration</Form.Label>
                            <Col sm="6">
                                <Form.Control type="number" name='duration' min="1" required onChange={(e) => setDuration(e.target.value)}/>
                                <FormControl.Feedback type="invalid">Please enter the duration</FormControl.Feedback>
                            </Col>
                        </Form.Group>
                        }

                        <Form.Group as={Row} className="mb-3" controlId="formBasicAnimationStudio(*)">
                            <Form.Label column sm="6">{formType === 'Anime' ? 'Animation' : 'Publication'} Studio</Form.Label>
                            <Col sm="6">
                                <Form.Control type="text" name='animation' required onChange={(e) => setAnimationStudio(e.target.value)}/>
                                <FormControl.Feedback type="invalid">Please enter the {formType === 'Anime' ? 'Animation' : 'Publication'} studio</FormControl.Feedback>
                            </Col>   
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group as={Row} className="mb-3" controlId="formBasicTitle(*)">
                            <Form.Label column sm="6">Title</Form.Label>
                            <Col sm="6">
                                <Form.Control type="text" name='title' required onChange={(e) => setTitle(e.target.value)}/>
                                <FormControl.Feedback type="invalid">Please enter the title</FormControl.Feedback>
                            </Col>
                        </Form.Group>
                            
                        <Form.Group as={Row} className="mb-3" controlId="formGridEpisodes">
                            <Form.Label column sm="6">No. of {formType === 'Anime' ? 'Episodes' : 'Chapters'}</Form.Label>
                            <Col sm="6">
                                <Form.Control type="number" name='duration'min="1" required onChange={(e) => setNoOfEpisodes(e.target.value)}/>
                                <FormControl.Feedback type="invalid">Please enter the no. of {formType === 'Anime' ? 'episodes' : 'chapters'}</FormControl.Feedback>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="formGridRelease">
                            <Form.Label column sm="6">Year of Release</Form.Label>
                            <Col sm="6">
                                <Form.Control type="date" name='release' required onChange={(e) => setYearOfRelease(e.target.value)}/>
                                <FormControl.Feedback type="invalid">Please enter the year of release</FormControl.Feedback>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="formGridEnd"> 
                            <Form.Label column sm="6">Year of End</Form.Label>
                            <Col sm="6">
                                <Form.Control type="date" name='end' onChange={(e) => setYearOfEnd(e.target.value)}/>
                                <FormControl.Feedback type="invalid">Please enter the year of end</FormControl.Feedback>
                            </Col>
                        </Form.Group>        
                    </Col>
                </Row>

                <Row>
                    <Form.Group as={Row} className="mb-3 pe-0" controlId="formHorizontalStory">
                        <Form.Label column sm="3">Story line</Form.Label>
                        <Col sm="9">
                            <Form.Control as="textarea" rows={4} placeholder="" name='story' required onChange={(e) => setStoryLine(e.target.value)}/>
                            <FormControl.Feedback type="invalid">Please enter the story line</FormControl.Feedback>
                        </Col>
                    </Form.Group>

                    {formType === 'Anime' &&
                    <Form.Group as={Row} className="mb-3 pe-0" controlId="formHorizontalContent">
                        <Form.Label column sm="3">Content Warning</Form.Label>
                        <Col sm="9">
                            <Form.Control type="text" placeholder="" name='content' onChange={(e) => setContentWarning(e.target.value)}/>
                            <FormControl.Feedback type="invalid">Please enter the content warning</FormControl.Feedback>
                        </Col>
                    </Form.Group>
                    }

                    <Form.Group as={Row} className="mb-3 pe-0" controlId="formHorizontalGenre">
                        <Form.Label column sm="3">Genre</Form.Label>
                        <Col sm="9">
                            <Form.Control type="text" placeholder="" name='genre' required onChange={(e) => setGenre(e.target.value)}/>
                            <FormControl.Feedback type="invalid">Please enter the genre</FormControl.Feedback>
                        </Col>
                    </Form.Group>

                    {formType === 'Anime' &&
                    <Form.Group as={Row} className="mb-3 pe-0" controlId="Soundtrack">
                        <Form.Label column sm="3">Soundtrack</Form.Label>
                        <Col sm="9">
                            <Form.Control type="text" placeholder="" name='sound' required onChange={(e) => setSoundTrack(e.target.value)}/>
                            <FormControl.Feedback type="invalid">Please enter the soundtrack</FormControl.Feedback>
                        </Col>
                    </Form.Group>    
                    } 
                </Row>
                
                <Row>
                    <Form.Group as={Row} controlId="formAnimePoster" className="mb-3 pe-0">
                        <Form.Label column sm="3">Upload {formType === 'Anime' ? 'Anime' : 'Manga'} Poster</Form.Label>
                        <Col sm="9">
                            <Form.Control type="file" name='animePoster' required onChange={(e) => storeFile(e, 'posterImg')}/>
                            <FormControl.Feedback type="invalid">Please upload the anime poster</FormControl.Feedback>
                        </Col>
                    </Form.Group>

                    {formType === 'Manga' &&
                        <Form.Group as={Row} controlId="forMangaHeader" className="mb-3 pe-0">
                        <Form.Label column sm="3">Upload Manga Header Image</Form.Label>
                        <Col sm="9">
                            <Form.Control type="file" name='mangaHeader' required onChange={(e) => storeFile(e, 'headerImg')}/>
                            <FormControl.Feedback type="invalid">Please upload the anime poster</FormControl.Feedback>
                        </Col>
                    </Form.Group>
                    }

                    {formType === 'Anime' &&
                    <Form.Group as={Row} controlId="formAnimeTrailer" className="mb-3 pe-0">
                        <Form.Label column sm="3" htmlFor="basic-url">Anime Trailer</Form.Label>
                        <Col sm="9">
                            <InputGroup className="mb-3" hasValidation>
                                <InputGroup.Text id="basic-addon3">Enter Link</InputGroup.Text>
                                <FormControl id="basic-url" aria-describedby="basic-addon3" name='animeTrailer' required onChange={(e) => setAnimeTrailer(e.target.value)}/>
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
                                    <Form.Control type="text" placeholder="Character Title" required onChange={(e) => setCharName(e.target.value)}/>
                                    <Form.Control.Feedback type="invalid"> Please Enter the Character Title</Form.Control.Feedback>
                                </th>
                                {formType === 'Anime' && 
                                    <th>
                                        <Form.Control type="text" placeholder="Character Vocal" required onChange={(e) => setCharVocal(e.target.value)}/>
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
                                        {formType === 'Anime' && <td>{ch.vocal}</td>}
                                        <td>
                                            <Button variant="outline-danger" className="border-0" onClick={() => {deleteCharacter(ch.id); setAddState(false)}}>
                                                <i class="fa-solid fa-trash"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                    // <p>hello</p>
                                )
                                }

                                )
                            }
                            {/* <tr>
                                <td>
                                </td>
                                <td>God</td>
                                <td>One Punch</td>
                                <td>
                                    <Button variant="outline-danger" className="border-0">
                                        <i class="fa-solid fa-pen"></i>
                                    </Button>
                                    <Button variant="outline-danger" className="border-0">
                                        <i class="fa-solid fa-trash"></i>
                                    </Button>
                                </td>
                            </tr> */}
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
                                
                                <th><Form.Control type="text" placeholder="Staff Title"  required onChange={(e) => setStaffName(e.target.value)}/>
                                    <Form.Control.Feedback type="invalid"> Please Enter the Staff Title</Form.Control.Feedback>
                                </th>

                                <th><Form.Control type="text" placeholder="Staff Role"  required onChange={(e) => setStaffRole(e.target.value)}/>
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
                                    // <p>hello</p>
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
    );
  }
// }

// render(<FormVal />);