import { React, useState, useEffect } from 'react'
import CardComponent from './CardComponent'
import { Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap'
import { db } from '../firebase-config'
import { query, getDocs, collection, where, orderBy } from "firebase/firestore";
import ReactPaginate from 'react-paginate'
import '../css/style.css'

export default function BrowseManga() {
  const [sortCriteria, setSortCriteria] = useState('Popular');
  const [valueMangaSort, setValueMangaSort] = useState('rating');

  const [mangaData, setMangaData] = useState([]);

  const fetchMangas = async () => {
    try {
      let sortOrder = 'desc'
      if(valueMangaSort === 'title')
        sortOrder = 'asc'

      const queryRes = query(collection(db, "animes"), where("itemType", "==", "manga"), orderBy(valueMangaSort, sortOrder));
      const docRes = await getDocs(queryRes);
      setMangaData(docRes.docs.map(doc => ({...doc.data(), id: doc.id})))
    }
    catch(err) {
      console.log(err);
      alert("An error occured while fetching mangas");
    }
  }

  useEffect(() => {
    if(valueMangaSort === 'rating') {
      setSortCriteria('Popular')
    }
    else if(valueMangaSort === 'title') {
      setSortCriteria('Name')
    }
    else if(valueMangaSort === 'addedDate') {
      setSortCriteria('Date Added')
    }
    else if(valueMangaSort === 'yor') {
      setSortCriteria('Latest')
    }
    else {
      setSortCriteria('Most Reading')
    }

    fetchMangas()
  }, [valueMangaSort]
)

const [pageNumber, setPageNumber] = useState(0);
const itemsPerPage = 4;
const pagesVisited = pageNumber * itemsPerPage;
const pageCount = Math.ceil(mangaData.length / itemsPerPage);

const displayMangas = mangaData.slice(pagesVisited, pagesVisited + itemsPerPage).map((a) => {
  return (
    <Col key={a.animeId} xs={12} md={6} lg={3}>
      <CardComponent type="manga" id={a.animeId} img={a.imgRef} title={a.title} rating={a.rating} date="" btnName="ReadList"/>
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
        <h2 className='text-center mt-5'>Browse Mangas</h2>

        <Row className="mt-5 px-3">
          <DropdownButton id="dropdown-basic-button" title={sortCriteria} onSelect={(e) => setValueMangaSort(e)} variant="danger">
            <Dropdown.Item eventKey="rating">Popular</Dropdown.Item>
            <Dropdown.Item eventKey="title">Name</Dropdown.Item>
            <Dropdown.Item eventKey="yor">Latest</Dropdown.Item>
            <Dropdown.Item eventKey="addedDate">Date Added</Dropdown.Item>
            <Dropdown.Item eventKey="reading">Most Reading</Dropdown.Item>
          </DropdownButton>
        </Row>

        <Row className="my-5">
          {/* {mangas.map((m) => (
            <Col key={m.title} xs={12} md={6} lg={3}>
              <CardComponent img={m.imgPath} title={m.title} rating={m.rating} btnName="ReadList"/>
            </Col>
          ))} */}
          {displayMangas}
        </Row>

        <Row className="mb-5">
          {/* <Pagination/> */}
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
