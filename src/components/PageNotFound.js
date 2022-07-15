import React from 'react'
import { Container } from 'react-bootstrap'

export default function PageNotFound() {
  return (
    <div>
        <Container className='my-5 fs-1 text-center'>
            <div>
            404 Page Not Found
            </div>
            <div className='mt-3'>
                <img src={process.env.PUBLIC_URL + '/../imgs/404Page.png'} width={500} height={500} className='img-fluid' alt="page-not-found"/>
            </div>
        </Container>
    </div>
  )
}
