import { React, useState } from 'react'
import CardComponent from './CardComponent'
import { Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap'
import { db } from '../firebase-config'
import { query, getDocs, collection, where, orderBy } from "firebase/firestore";
import '../css/style.css'
import { useEffect } from 'react'
import ReactPaginate from 'react-paginate'

export default function BrowseAnime() {
  const [sortCriteria, setSortCriteria] = useState('Popular');
  const [valueAnimeSort, setValueAnimeSort] = useState('rating');

  const [animeData, setAnimeData] = useState([]);

  const fetchAnimes = async () => {
    try {
      let sortOrder = 'desc'
      if(valueAnimeSort === 'title')
        sortOrder = 'asc'

      const queryRes = query(collection(db, "animes"), where("itemType", "==", "anime"), orderBy(valueAnimeSort, sortOrder));
      // const doc = await getDocs(queryRes);
      // doc.forEach(anime => {
      //   var data = anime.data();
      //   setAnimeData(ele => [...ele, data]);
      // })
      const docRes = await getDocs(queryRes);
      setAnimeData(docRes.docs.map(doc => ({...doc.data(), id: doc.id})))
    }
    catch(err) {
      console.log(err);
      alert("An error occured while fetching animes");
    }
  }

  useEffect(() => {
    if(valueAnimeSort === 'rating') {
      setSortCriteria('Popular')
    }
    else if(valueAnimeSort === 'title') {
      setSortCriteria('Name')
    }
    else if(valueAnimeSort === 'addedDate') {
      setSortCriteria('Date Added')
    }
    else if(valueAnimeSort === 'yor') {
      setSortCriteria('Latest')
    }
    else {
      setSortCriteria('Most Watched')
    }

    fetchAnimes()
    }, [valueAnimeSort]
  )

  const [pageNumber, setPageNumber] = useState(0);
  const itemsPerPage = 4;
  const pagesVisited = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(animeData.length / itemsPerPage);

  const displayAnimes = animeData.slice(pagesVisited, pagesVisited + itemsPerPage).map((a) => {
    return (
      <Col key={a.animeId} xs={12} md={6} lg={3}>
        <CardComponent type="anime" id={a.animeId} img={a.imgRef} title={a.title} rating={a.rating} btnName="Watchlist" date=""/>
      </Col>
    );
  }); 
  
  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <>
        {/* <NavBar /> */}

        <Container>
          <h2 className='text-center mt-5'>Browse Animes</h2>

          <Row className="mt-5 px-3">
            <DropdownButton id="dropdown-basic-button" title={sortCriteria} onSelect={(e) => setValueAnimeSort(e)} variant="danger">
              <Dropdown.Item eventKey="rating">Popular</Dropdown.Item>
              <Dropdown.Item eventKey="title">Name</Dropdown.Item>
              <Dropdown.Item eventKey="yor">Latest</Dropdown.Item>
              <Dropdown.Item eventKey="addedDate">Date Added</Dropdown.Item>
              <Dropdown.Item eventKey="watched">Most Watched</Dropdown.Item>
            </DropdownButton>
          </Row>

          <Row className="my-5">
            {/* {currentItems.map((a) => (
              <Col key={a.animeId} xs={12} md={6} lg={3}>
                <CardComponent type="anime" id={a.animeId} img={a.imgRef} title={a.title} rating={a.rating} btnName="Watchlist"/>
              </Col>
            ))} */}
            {displayAnimes}
          </Row>

          <Row className="mb-5">
            <ReactPaginate
              previousLabel={'<<'}
              nextLabel={'>>'}
              breakLabel={'...'}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={'pagination justify-content-center flex-wrap'}
              pageClassName={'page-item'}
              pageLinkClassName={'page-link'}
              previousClassName={'page-item'}
              previousLinkClassName={'page-link'}
              nextClassName={'page-item'}
              nextLinkClassName={'page-link'}
              breakClassName={'page-item'}
              breakLinkClassName={'page-link'}
              activeClassName={'active'}
            />
          </Row>
        </Container>

        {/* <Footer/> */}
    </>
  )
}
