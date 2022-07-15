import onePunchMan from './Images/onePunchMan.jpg';
import edit from './Images/edit.png';
import deleteBin from './Images/deleteBin.png';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import React, { useState } from 'react';

export default function Manga(){

  // function FormVal() {
      const [validated, setValidated] = useState(false);
    
      const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
          
        }
    
        setValidated(true);
      };
  return(
      <>
      <Container  className='m-0'> 
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                  <Col sm="4">
                      <Form.Group as={Row} className="mb-3" controlId="formGridAdd">
                          <Form.Label column sm="3">Add</Form.Label>
                          <Col sm="5">
                              <Form.Select defaultValue="Choose...">
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
                      </Form.Group>

                      <Form.Group as={Row} className="mb-3" controlId="formBasicDuration(*)">
                          <Form.Label column sm="3">Duration</Form.Label>
                          <Col sm="3">
                              <Form.Control type="number" name='duration' min="1" required/>
                              <FormControl.Feedback type="invalid">Please enter the duration</FormControl.Feedback>
                          </Col>
                      </Form.Group>

                      <Form.Group as={Row} className="mb-3" controlId="formBasicAnimationStudio(*)">
                          <Form.Label column sm="3">Animation Studio</Form.Label>
                          <Col sm="7">
                              <Form.Control type="text" name='animation' required/>
                              <FormControl.Feedback type="invalid">Please enter the animation studio</FormControl.Feedback>
                          </Col>   
                      </Form.Group> */}
                  </Col>

                  <Col>
                      <Form.Group as={Row} className="mb-3" controlId="formBasicTitle(*)">
                          <Form.Label column sm="2">Title</Form.Label>
                          <Col sm="3">
                              <Form.Control type="text" name='title' required/>
                              <FormControl.Feedback type="invalid">Please enter the title</FormControl.Feedback>
                          </Col>
                      </Form.Group>
                          
                      {/* <Form.Group as={Row} className="mb-3" controlId="formGridEpisodes">
                          <Form.Label column sm="2">No. of episodes</Form.Label>
                          <Col sm="3">
                              <Form.Control type="number" name='duration'min="1" required/>
                              <FormControl.Feedback type="invalid">Please enter the no. of episodes</FormControl.Feedback>
                              
                          </Col>
                      </Form.Group> */}

                      <Form.Group as={Row} className="mb-3" controlId="formGridRelease">
                          <Form.Label column sm="2">Year of Release</Form.Label>
                          <Col sm="3">
                              <Form.Control type="date" name='release' required/>
                              <FormControl.Feedback type="invalid">Please enter the year of release</FormControl.Feedback>
                          </Col>
                      </Form.Group>

                      <Form.Group as={Row} className="mb-3" controlId="formGridEnd"> 
                          <Form.Label column sm="2">Year of End</Form.Label>
                          <Col sm="3">
                              <Form.Control type="date" name='end' required/>
                              <FormControl.Feedback type="invalid">Please enter the year of end</FormControl.Feedback>
                          </Col>
                      </Form.Group>     
                  </Col>
              </Row>

              <Row>
                  <Form.Group as={Row} className="mb-3" controlId="formHorizontalStory">
                      <Form.Label column sm="1">Story line</Form.Label>
                      <Col sm="5">
                          <Form.Control as="textarea" rows={3} placeholder="" name='story' required/>
                          <FormControl.Feedback type="invalid">Please enter the story line</FormControl.Feedback>
                      </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3" controlId="formHorizontalContent">
                      <Form.Label column sm="1">Content Warning(*)</Form.Label>
                      <Col sm="3">
                          <Form.Control type="text" placeholder="" name='content' required/>
                          <FormControl.Feedback type="invalid">Please enter the content warning</FormControl.Feedback>
                      </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3" controlId="formHorizontalGenre">
                      <Form.Label column sm="1">Genre</Form.Label>
                      <Col sm="3">
                          <Form.Control type="text" placeholder="" name='genre' required/>
                          <FormControl.Feedback type="invalid">Please enter the genre</FormControl.Feedback>
                      </Col>
                      <Form.Label column sm="1">Add More</Form.Label>
                      <Col sm="1">
                          <Form.Select>
                              <option>1</option>
                              <option>1</option>
                          </Form.Select>
                      </Col>    
                  </Form.Group>

                  {/* <Form.Group as={Row} className="mb-3" controlId="Soundtrack">
                      <Form.Label column sm="1">Soundtrack(*)</Form.Label>
                      <Col sm="3">
                          <Form.Control type="text" placeholder="" name='sound' required/>
                          <FormControl.Feedback type="invalid">Please enter the soundtrack</FormControl.Feedback>
                      </Col>
                      <Form.Label column sm="1">Add More</Form.Label>
                      <Col sm="1">
                          <Form.Select>
                              <option>1</option>
                              <option>1</option>
                          </Form.Select>
                      </Col>
                  </Form.Group>      */}
              </Row>
              
              <Row>
                  <Form.Group as={Row} controlId="formAnimePoster" className="mb-3">
                      <Form.Label column sm="2">Upload Manga Poster</Form.Label>
                      <Col sm="3">
                          <Form.Control type="file" name='animePoster' required/>
                          <FormControl.Feedback type="invalid">Please upload the Manga poster</FormControl.Feedback>
                      </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId="formHeaderImage" className="mb-3">
                      <Form.Label column sm="2">Upload Manga Header Image</Form.Label>
                      <Col sm="3">
                          <Form.Control type="file" name='mangaheaderImage' required/>
                          <FormControl.Feedback type="invalid">Please upload the Manga Header Image</FormControl.Feedback>
                      </Col>
                  </Form.Group>

                  {/* <Form.Group as={Row} controlId="formAnimeTrailer" className="mb-3">
                      <Form.Label column sm="2" htmlFor="basic-url">Manga Header Image</Form.Label>
                      <Col sm="5">
                          <InputGroup className="mb-3" hasValidation>
                              <InputGroup.Text id="basic-addon3">Enter Link</InputGroup.Text>
                              <FormControl id="basic-url" aria-describedby="basic-addon3" name='animeTrailer' required/>
                              <Form.Control.Feedback type="invalid"> Please Enter the link</Form.Control.Feedback>
                          </InputGroup>
                      </Col>
                  </Form.Group> */}
              </Row>

              <Row>
                  {/* <Form.Group as={Row} controlId="characterImage" className="mb-3">
                      <Form.Label column sm="2">Character Image</Form.Label>
                      <Col sm="3">
                          <Form.Control type="file" placeholder="Character Image" />
                      </Col>
                      <Col>
                          <Form.Control type="text" placeholder="Character Title" />
                      </Col>
                      <Col>
                          <Form.Control type="text" placeholder="Character Role" />
                      </Col>
                      <Col>
                          <Button variant="outline-dark">ADD</Button>
                      </Col>
                  </Form.Group> */}
                  <Table striped bordered>
                      <thead>
                          <tr>
                              {/* <th>Character Image</th>
                              <th>Character Title</th>
                              <th>Character Role</th>
                              <th><Button variant="outline-dark">ADD</Button></th> */}
                              <th>
                                  <Form.Group as={Row} controlId="characterImage" >
                                      <Form.Label column sm="3">Character Image</Form.Label>
                                      <Col>
                                          <Form.Control type="file" required/>
                                          {/* <Form.Control.Feedback>No file chosen</Form.Control.Feedback> */}
                                      </Col>
                                  </Form.Group>
                              </th>
                              <th>
                                  <Form.Control type="text" placeholder="Character Title" required />
                                  <Form.Control.Feedback type="invalid"> Please Enter the Character Title</Form.Control.Feedback>
                              </th>
                              <th>
                                  <Form.Control type="text" placeholder="Character Role" required/>
                                  <Form.Control.Feedback type="invalid"> Please Enter the Character Role</Form.Control.Feedback>
                              </th>
                              <th><Button variant="outline-dark">ADD</Button></th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td><img src={onePunchMan} alt="OnePunchMan" width={150} height={100}/></td>
                              <td>God</td>
                              <td>One Punch</td>
                              <td>
                                  <Button variant="outline-secondary" className="m-1 p-0">
                                      <img src={edit} alt="edit image" width={20} height={20} />
                                  </Button>
                                  <Button variant="outline-secondary" className="m-1 p-0">
                                      <img src={deleteBin} alt="delete image" width={20} height={20} />
                                  </Button>
                              </td>
                          </tr>
                      </tbody>
                  </Table>

                  <Table striped bordered>
                      <thead>
                          <tr>
                              {/* <th>Staff Image</th>
                              <th>Staff Title</th>
                              <th>Staff Role</th>
                              <th><Button variant="outline-dark">ADD</Button></th> */}
                              <th>
                                  <Form.Group as={Row} controlId="staffImage" >
                                      <Form.Label column sm="2">Staff Image</Form.Label>
                                      <Col>
                                          <Form.Control type="file" required/>
                                      </Col>
                                  </Form.Group>
                              </th>
                              
                              <th><Form.Control type="text" placeholder="Staff Title"  required/>
                                  <Form.Control.Feedback type="invalid"> Please Enter the Staff Title</Form.Control.Feedback>
                              </th>

                              <th><Form.Control type="text" placeholder="Staff Role"  required/>
                                  <Form.Control.Feedback type="invalid"> Please Enter the Staff Role</Form.Control.Feedback>
                              </th>

                              <th><Button variant="outline-dark">ADD</Button></th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td><img src={onePunchMan} alt="OnePunchMan" width={150} height={100} /></td>
                              <td>God</td>
                              <td>One Punch</td>
                              <td>
                                  <Button variant="outline-secondary" className="m-1 p-0">
                                      <img src={edit} alt="edit image" width={20} height={20} />
                                  </Button>
                                  <Button variant="outline-secondary" className="m-1 p-0">
                                      <img src={deleteBin} alt="delete image" width={20} height={20} />
                                  </Button>
                              </td>
                          </tr>
                      </tbody>
                  </Table>
              </Row>
              <Button type="submit" className="float-end mb-3 me-3 px-4" bsStyle="success">Save</Button>
          </Form>
      </Container>
      </>
  );
}