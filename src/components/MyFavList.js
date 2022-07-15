import { React, useState, useEffect } from 'react'
import { db, auth } from '../firebase-config'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Dropdown, DropdownButton, Tabs, Tab } from 'react-bootstrap'
import { useAuthState } from 'react-firebase-hooks/auth'
import { query, getDocs, collection, where, doc, updateDoc, deleteDoc } from "firebase/firestore"
import '../css/style.css'

function MyFavListItem(props) {
  const { docId, id, type, status } = props;

  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const [valueAnimeStatus, setValueAnimeStatus] = useState(status);
  const handleSelectAnimeStatus = (e) => {
    setValueAnimeStatus(e)
    // navigate('/');
  }

  const [valueMangaStatus, setValueMangaStatus] = useState(status);
  const handleSelectMangaStatus = (e) => {
    setValueMangaStatus(e)
  }

  const updateFavListItem = async() => {
    try{
      const flDoc = doc(db, "favlist", docId);

      if(type === 'anime')
        await updateDoc(flDoc, {status: valueAnimeStatus});
      else
        await updateDoc(flDoc, {status: valueMangaStatus});
    }
    catch(err) {
      console.log(err);
    }
  }

  const [resData, setResData] = useState([]);
  const fetchData = async () => {
    try {
      const queryRes = query(collection(db, 'animes'), where('animeId', '==', id));
      const docRes = await getDocs(queryRes);
      setResData(docRes.docs.map(doc => ({...doc.data(), id: doc.id})))
      // const data = docRes.docs[0].data();
      // const idItemToBeUpdated = docRes.docs[0].id;
      // setResData(idItemToBeUpdated);
    }
    catch(err) {
      console.log(err);
      // alert("An error occured while fetching data 1");
    }
  }

  useEffect(() => {
    if(!user && !localStorage.getItem('User'))
      navigate('/sign-in', {state: "/my-fav-list"});
    else
      localStorage.setItem('User', user)

    fetchData()
  }, [])

  // const [oldValue, setOldValue] = useState('');

  // const fetchItem = async() => {
  //   try {
  //     const queryItem = query(collection(db, 'favlist'), where('itemId', '==', id));
  //     const docRes = await getDocs(queryItem);
  //     setOldValue(docRes.docs.map(doc => ({...doc.data(), id: doc.id})))
  //   }
  //   catch(err) {
  //     console.log(err);
  //   }
  // }

  const updateItem = async(val) => {
    // console.log(oldValue[0].status)
    // console.log(val)
    try{
      const iDoc = doc(db, "animes", resData[0].id);

      // if(oldValue[0].status === 'Watched') {
      //   console.log("watched ", resData[0].watched - 1)
      //   await updateDoc(iDoc, {watched: Number(resData[0].watched - 1)});
      // }
      // else if(oldValue[0].status === 'Watching') {
      //   console.log("watching ", resData[0].watching - 1)
      //   await updateDoc(iDoc, {watching: Number(resData[0].watching - 1)});
      // }
      // else if(oldValue[0].status === 'Want to Watch') {
      //   // console.log(oldValue[0].status)
      //   console.log("want to watch ", resData[0].wantToWatch - 1)
      //   await updateDoc(iDoc, {wantToWatch: Number(resData[0].wantToWatch - 1)});
      // }

      // console.log(oldValue[0].status
      if(val === 'watched') {
        console.log("watched ", resData[0].watched + 1)
        await updateDoc(iDoc, {watched: Number(resData[0].watched + 1)});
      }
      else if(val === 'watching') {
        console.log("watching ", resData[0].watching + 1)
        await updateDoc(iDoc, {watching: Number(resData[0].watching + 1)});
      }
      else if(val === 'wantToWatch') {
        console.log("want to watch ", resData[0].wantToWatch + 1)
        await updateDoc(iDoc, {wantToWatch: Number(resData[0].wantToWatch + 1)});
      }
      else if(val === 'reading')
        await updateDoc(iDoc, {reading: Number(resData[0].reading + 1)});
      else if(val === 'wantToRead')
        await updateDoc(iDoc, {wantToRead: Number(resData[0].wantToRead + 1)});
      else
        await updateDoc(iDoc, {dropped: Number(resData[0].dropped + 1)});
    }
    catch(err) {
      console.log(err);
    } 
  }

  const [dropDown, setDropDown] = useState(false)

  const deleteFavListItem = async() => {
    try{
      const dDoc = doc(db, "favlist", docId);
      await deleteDoc(dDoc);
      // window.location.reload(false);
      // props.drop(Math.floor(Math.random() * 100) + 1)
      setDropDown(true)
    }
    catch(err) {
      console.log(err);
    } 
  }

  useEffect(() => {
    fetchData()
    // fetchItem()

    if(status !== valueAnimeStatus || status !== valueMangaStatus) {
      updateFavListItem();

      if(type === 'anime' && valueAnimeStatus === 'Watched') 
        updateItem('watched');
      else if(type === 'anime' && valueAnimeStatus === 'Watching') 
        updateItem('watching')
      else if(type === 'anime' && valueAnimeStatus === 'Want to Watch') 
        updateItem('wantToWatch')
      else if(type === 'anime' && valueAnimeStatus === 'Dropped') {
        updateItem('dropped')
        deleteFavListItem();
      }

    if(type === 'manga' && valueMangaStatus === 'Reading') 
      updateItem('reading');
    else if(type === 'manga' && valueMangaStatus === 'Want to Read') 
      updateItem('wantToRead')
    else if(type === 'manga' && valueMangaStatus === 'Dropped') {
      updateItem('dropped')
      deleteFavListItem();

    }
    }

    navigate('/my-fav-list');
  }, [valueAnimeStatus, valueMangaStatus])

  return (
    <>
      <Row className='py-3 mx-auto fav-list-row'>
        <Col xs={12} md={3} lg={2}>
          <img src={resData[0] && resData[0].imgRef} width={150} height={150} alt={resData[0] && resData[0].title}/>
        </Col>
        <Col xs={12} md={9} lg={8}>
        {/* <a href={`/${type}/${id}/${user.uid}`} style={{textDecoration: "none"}} className="title">{title}</a> */}
          <p className='mt-2'><a href={`/${type}/${id}/${user.uid}`} style={{textDecoration: "none"}} className="title">{resData[0] && resData[0].title}</a></p>
          <p>
            <span>{resData[0] && resData[0].yearOfRelease.substring(0,4)}-{resData[0] && resData[0].yearOfEnd === '' ? '?' : resData[0] && resData[0].yearOfEnd.substring(0,4)} | </span>
            {/* {type === "anime" &&  <span>Type | </span>} */}
            {type === "anime" &&  <span>{resData[0] && resData[0].noOfEpisodes}eps x {resData[0] && resData[0].duration}mins {resData[0] && resData[0].noOfEpisodes === "1" ? '(Movie)' : '(TV Series)'} | </span>}
            {type === "manga" &&  <span>{resData[0] && resData[0].noOfEpisodes}Chps | </span>}
            <span>{resData[0] && resData[0].genre}</span>
          </p>
          <p className='d-flex gap-3 align-items-center'>
            <span><i className="fa-solid fa-star"></i>{resData[0] && (Math.round(resData[0].rating * 100) / 100).toFixed(1)}/10</span>
            {type === "anime" && 
            <DropdownButton id="dropdown-basic-button" title={valueAnimeStatus} onSelect={handleSelectAnimeStatus} variant="danger" style={{ display: "inline-block"}} disabled={dropDown}>
              <Dropdown.Item eventKey="Unwatched">Unwatched</Dropdown.Item>
              <Dropdown.Item eventKey="Watched">Watched</Dropdown.Item>
              <Dropdown.Item eventKey="Watching">Watching</Dropdown.Item>
              <Dropdown.Item eventKey="Want to Watch">Want to Watch</Dropdown.Item>
              <Dropdown.Item eventKey="Dropped">Dropped</Dropdown.Item>
            </DropdownButton>
            }

            {type === "manga" && 
            <DropdownButton id="dropdown-basic-button" title={valueMangaStatus} onSelect={handleSelectMangaStatus} variant="danger" style={{ display: "inline-block"}} disabled={dropDown}>
              <Dropdown.Item eventKey="Unread">Unread</Dropdown.Item>
              <Dropdown.Item eventKey="Reading">Reading</Dropdown.Item>
              <Dropdown.Item eventKey="Want to Read">Want to Read</Dropdown.Item>
              <Dropdown.Item eventKey="Dropped">Dropped</Dropdown.Item>
            </DropdownButton>
            }

            {/* <span>Current Status: {valueAnimeStatus}</span> */}
          </p>
        </Col>
      </Row>
    </>
  )
}

export default function MyFavList() {
  // const arr = [1,2,3,4,5];
  const [favAnimeList, setFavAnimeList] = useState([]);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const fetchAnimeList = async() => {
    let tempUid = localStorage.getItem('UserId')
    try {
      const queryAnime = query(collection(db, "favlist"), where("uid", '==', tempUid || user.uid), where("itemType", '==', 'anime'));
      const docRes = await getDocs(queryAnime);
      setFavAnimeList(docRes.docs.map(doc => ({...doc.data(), id: doc.id})))
      // const data = docRes.docs[0].data() || null;
    }
    catch(err) {
      console.log(err);
      // alert("An error occured while fetching favlist");
    } 
  }

  const [favMangaList, setFavMangaList] = useState([]);
  const fetchMangaList = async() => {
    let tempUid = localStorage.getItem('UserId')
    // console.log(tempUid)
    try {
      const queryManga = query(collection(db, "favlist"), where("uid", '==', tempUid || user.uid), where("itemType", '==', 'manga'));
      const docRes = await getDocs(queryManga);
      setFavMangaList(docRes.docs.map(doc => ({...doc.data(), id: doc.id})))
      // const data = docRes.docs[0].data() || null;
    }
    catch(err) {
      console.log(err);
      // alert("An error occured while fetching favlist");
    } 
  }

  useEffect(() => {
    if(user) {
      fetchAnimeList();
      fetchMangaList();
      localStorage.setItem('User', user)
      localStorage.setItem('UserId', user.uid)
    }
    else if(!user && !localStorage.getItem('User'))
      navigate('/sign-in', {state: "/my-fav-list"});
  }, [user])


  return (
    <>
        {/* <NavBar /> */}

        <Container className='my-5'>
          <Tabs defaultActiveKey="anime" id="uncontrolled-tab-example" className="mb-3 tab-color">
            <Tab eventKey="anime" title="Anime">
              {favAnimeList.length !== 0 ? favAnimeList.map((a) => <MyFavListItem user={user} type="anime" docId={a.id} id={a.itemId} status={a.status} /*drop={getDrop}*//>) 
              : <p>No animes</p>} 
            </Tab>
            <Tab eventKey="manga" title="Manga">
              {favMangaList.length !== 0 ? favMangaList.map((m) => <MyFavListItem user={user} type="manga" docId={m.id} id={m.itemId} status={m.status} /*drop={getDrop}*//>) 
              : <p>No mangas</p>}
            </Tab>
          </Tabs>
        </Container>

        {/* <Footer /> */}
    </>
  )
}
