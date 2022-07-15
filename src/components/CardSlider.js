import { React } from 'react'
import Slider from "react-slick"
import { Container } from 'react-bootstrap'
import CardComponent from './CardComponent'
import '../css/style.css'

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style,fontSize: "2rem", display: 'block', background: "black", height:"2rem", width:"2rem", opacity:"1", color:"White", padding: "0.4rem", borderRadius: "50%"}}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style,fontSize: "2rem", display: 'block', background: "black", height:"2rem", width:"2rem", opacity:"1", color:"White", padding: "0.4rem", borderRadius: "50%"}}
      onClick={onClick}
    />
  );
}

export default function CardSlider(props) {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              dots: false
            }
          }
        ]
      };

      const { type, data, date } = props;

      return (
        <Container>
          <Slider {...settings}>
            {data && data.map((d) => (
              <div>
                {/* <CardComponent img={d.imgPath} title={d.title} rating={d.rating} btnName={btnName} /> */}
                <CardComponent type={type} id={d.animeId} img={d.imgRef} title={d.title} rating={d.rating} btnName={type === 'anime' ? 'Watchlist' : 'Readlist'} date={date === "yes" ? d.yearOfRelease : ""}/>
                {/* {d.title} */}
              </div>
            ))}
          </Slider>
        </Container>
      );
}
