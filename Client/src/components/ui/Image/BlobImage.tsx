import { useEffect, useState } from "react"

function BlobImage({
    blob,
    alt,
    className
}: {
    blob: Blob,
    alt: string,
    className: string
}) {
    const [url, setUrl] = useState<string>("");

    useEffect(() => {
        if (blob && blob instanceof Blob) {
            const objectUrl = URL.createObjectURL(blob);
            setUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [blob]);

    if (!url) return null;

    return <img src={url} alt={alt} className={className} />;
}

export default BlobImage;