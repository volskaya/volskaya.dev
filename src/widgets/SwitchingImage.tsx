import {Photo} from "../util/photo";
import Image from "next/image";

export default function SwitchingImage({photo}: {photo: Photo}) {
  return (
    <Image
      width={photo.width}
      height={photo.height}
      src={`/img/${photo.name}.webp`}
      objectFit="cover"
      priority={true}
      unoptimized={true}
    />
  );
}
