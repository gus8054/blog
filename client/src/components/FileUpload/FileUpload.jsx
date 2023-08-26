import { useRef, useState } from "react";
import "./fileUpload.css";

const FileUpload = ({
  imageURL,
  imageChangeHandler,
  className: _className,
}) => {
  const [lodding, setLodding] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();
  const className = ["file-upload", _className].join(" ");
  const imageFileReaderP = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const result = e.target?.result;
        if (result && typeof result === "string") resolve(result);
        else reject(new Error(`imageFileReaderP : cant't read image file`));
      };
      fileReader.readAsDataURL(file);
    });
  };
  const onInputChange = (e) => {
    const file = e.target.files[0];
    setLodding(true);
    imageFileReaderP(file)
      .then(imageChangeHandler)
      .catch(setError)
      .finally(() => setLodding(false));
  };
  const onClick = () => {
    inputRef.current?.click();
  };
  return (
    <div className={className} onClick={onClick}>
      <div className="file-upload__image-container">
        {lodding && <p className="file-upload__lodding">로딩</p>}
        {error && <p className="file-upload__error">에러</p>}
        {imageURL && <img src={imageURL} alt={imageURL} />}
        {!lodding && !error && !imageURL && (
          <p className="file-upload__text">이미지 업로드</p>
        )}
      </div>

      <input
        ref={inputRef}
        name="imageURL"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  );
};

export default FileUpload;
