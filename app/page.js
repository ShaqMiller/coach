'use client';
import Image from "next/image";

export default function Home() {

  const handleScrapeTiktokVideos = async()=>{
    const res = await fetch('/api/tiktok/scrape/account/kiulle');
    const data = await res.json();
    console.log(data.videos);
  }

  return (


    <div className="home">
        <div onClick={()=>handleScrapeTiktokVideos()}>TEST</div>
    </div>
  );
}
