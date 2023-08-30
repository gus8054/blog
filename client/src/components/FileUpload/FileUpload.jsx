import { useRef, useState } from "react";
import "./fileUpload.css";

const FileUpload = ({ file, setFile, className: _className }) => {
  const [lodding, setLodding] = useState(false);
  const [error, setError] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
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
    const file = e.target.files?.[0];
    // 취소버튼 눌렀을 경우
    if (!file) return;
    // 용량이 큰 경우
    const { size } = file;
    if (size >= 1_000_000) {
      alert("1MB 이하의 사진만 업로드할 수 있습니다.");
      return;
    }
    // 진행
    setLodding(true);
    setFile(file);
    imageFileReaderP(file)
      .then((data) => setImageBase64(data))
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
        {imageBase64 && <img src={imageBase64} alt="업로드한 이미지" />}
        {!lodding && !error && !imageBase64 && (
          <p className="file-upload__text">이미지 업로드</p>
        )}
      </div>

      <input
        ref={inputRef}
        filename={file}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  );
};

export default FileUpload;
