import { CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import './LastNews.css';
import { motion } from 'framer-motion';
import { Carousel } from 'react-responsive-carousel';
import { Title } from '@mui/icons-material';
import ScaleText from '../ScaleText/ScaleText';

const URL = 'https://vk.com/skoipt_professionalitet';

function packImages(images: Array<string>): JSX.Element[]
{
  let packedImages = new Array<JSX.Element>()
  let slideImages = new Array<JSX.Element>()

  for (let i = 0; i < images.length; i++)
  {
    slideImages.push(
      <img 
        src={images[i]} 
        className='LastNews__image'
      />
    )

    if (slideImages.length % 3 == 0)
    {
      packedImages.push(
        <div className='LastNews__images-container'>
          {slideImages}
        </div>
      )
      slideImages = new Array<JSX.Element>()
    }
  }

  if (slideImages.length > 0)
  {
    packedImages.push(
      <div className='LastNews__images-container'>
        {slideImages}
      </div>
    )
  }

  return packedImages;
}

export default function LastNews() {
  const [images, setImages] = useState(new Array<string>());
  const [text, setText] = useState('Загрузка');

  useEffect(() => 
  {
    axios
      .get(URL)
      .then((response) => 
      {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(response.data, 'text/html');

        let text = '';
        let images: string[] = [];
        
        //let postTextEl = htmlDoc.querySelectorAll(".wall_post_text")[n];
        let postTextEl = htmlDoc.querySelector(".wall_post_text");
        let postContentEl = postTextEl?.parentElement;

        // images
        postContentEl
          ?.querySelectorAll("div")[1]
          ?.querySelectorAll("img")
          .forEach(element => {
            if (element.classList.value.indexOf("PhotoPrimaryAttachment__imageElement") > -1 ||
              element.classList.value.indexOf("MediaGrid__imageElement") > -1)
            {
              images.push(element.src)
            }
        });
        
        // text
        postContentEl?.querySelectorAll("a").forEach(el => {
          el.remove()
        })
        postContentEl?.querySelector("button")?.remove()

        text = postContentEl?.innerText ?? ""

        // sets
        setText(text);
        setImages(images);
      })
      .catch((e) => {
        console.log("error: " + e)
        setText('Не удалось загрузить');
      });
  }, []);


  return (
    <div className='LastNews__container'>
      <div className='LastNews__text-container'>
        <ScaleText
          widthContainer={870}
          heightContainer={365}
          maxSizeFont={45}>
            {text}
        </ScaleText>
      </div>

      <Carousel 
        className='LastNews__carousel-container'
        interval={5000}
        autoPlay
        showArrows={true}
        showStatus={false}
        showIndicators={true}
        infiniteLoop
        showThumbs={false}
        stopOnHover={false}
      >
        {packImages(images)}
      </Carousel>
    </div>
  );
}
