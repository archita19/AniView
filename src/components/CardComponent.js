import { React, useState, useEffect } from 'react'
import { Card, Button} from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { db, auth } from '../firebase-config'
import { query, getDocs, collection, where, addDoc } from "firebase/firestore"
import '../css/style.css'

export default function CardComponent(props) {
  const { type, id, img, title, rating, btnName, date } = props;

  const [favList, setFavList] = useState('');
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const fetchList = async() => {
    try {
      // console.log(user.uid)
      const queryList = query(collection(db, "favlist"), where("itemId", "==", id), where("uid", '==', user.uid));
      const docRes = await getDocs(queryList);
      // setResReviews(docRes.docs.map(doc => ({...doc.data(), id: doc.id})))
      const data = docRes.docs[0].data() || null;
      setFavList(data.title)
    }
    catch(err) {
      console.log(err);
      // alert("An error occured while fetching favlist");
    } 
  }

  const addToFavList = async() => {
    let status = 'Unwatched'
    if(type === 'manga')
      status = 'Unread';

    try {
      await addDoc(collection(db, "favlist"), {
          itemType: type,
          fid: String('favlist' + new Date().getTime()),
          uid: user.uid,
          itemId: id,
          status: status,
          title: title
      });

      navigate("/my-fav-list");
    }
    catch(err) {
        console.log(err);
    }
  }

  const handleClick = () => {
    if(!user)
      navigate("/sign-in", {state: "item-card"});
    else {
      console.log(favList)
      if(favList) {
        alert(`${favList} is already added in your FavList!`);
        navigate("/my-fav-list");
      }
      else {
        addToFavList();
      }
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <Card className='cardBg m-3'>
      <div className='inner'>
        <a href={`/${type}/${id}`}>
          <Card.Img variant="top" src={img}/>
        </a>
      </div>
      <Card.Body>
          <div className='d-flex gap-2 justify-content-between'>
          <span><i className="fa-solid fa-star"></i> {(Math.round(rating * 100) / 100).toFixed(1)}</span>
          {date !== "" && <span>{new Date(date).getDate()} {new Date(date).toLocaleString("default", { month: "short", year: "numeric" })}</span>}
          </div>
          <Card.Title as={Link} to={`/${type}/${id}`} style={{textDecoration: 'none', display: 'block' }}>{title}</Card.Title>
          <Button variant="danger" className='w-100' onClick={handleClick}><i className="fa-solid fa-plus"></i>{btnName}</Button>
      </Card.Body>
    </Card>
  )
}
