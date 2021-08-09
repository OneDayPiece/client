import React from "react";
import styled from "styled-components";
import camera from "../../images/icons/camera.svg";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as imageActions } from "../../redux/modules/challengeCreate";

// icons
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import { Image } from "../../elements";

function CreateCertification({ challengeInfo, setChallengeInfo, id }) {
  const dispatch = useDispatch();

  // image preview
  const goodFileInput = React.useRef();
  const badFileInput = React.useRef();

  const goodPreview = useSelector((state) => state.create.goodPreview);
  const badPreview = useSelector((state) => state.create.badPreview);

  const goodSelectFile = (e) => {
    const reader = new FileReader();
    const goodFile = goodFileInput.current.files[0];

    if (!goodFile) {
      return;
    }

    reader.readAsDataURL(goodFile);

    reader.onloadend = () => {
      dispatch(imageActions.setGoodPreview(reader.result));
      setChallengeInfo({ ...challengeInfo, challengeGood: goodFile });
    };
  };

  const badSelectFile = (e) => {
    const reader = new FileReader();
    const badFile = badFileInput.current.files[0];

    if (!badFile) {
      return;
    }

    reader.readAsDataURL(badFile);

    reader.onloadend = () => {
      dispatch(imageActions.setBadPreview(reader.result));
      setChallengeInfo({ ...challengeInfo, challengeBad: badFile });
    };
  };

  return (
    <>
      <Certification>
        <div>인증샷 예시 등록</div>
        <CertificationBox>
          <Good>
            {goodPreview ? (
              <PreviewBtn htmlFor="ex_file">
                <Image
                  width="7.08vw"
                  height="12.59vh"
                  src={goodPreview}
                  alt="goodPreview"
                />
              </PreviewBtn>
            ) : (
              <Preview>
                {" "}
                <PreviewBtn htmlFor="ex_file">
                  {" "}
                  <Image
                    width="1.04vw"
                    height="1.85vh"
                    src={camera}
                    alt="camera"
                  />{" "}
                </PreviewBtn>{" "}
              </Preview>
            )}{" "}
            <input
              onChange={goodSelectFile}
              ref={goodFileInput}
              id="ex_file"
              type="file"
            />
          </Good>
          <Bad>
            <label htmlFor="ex_files">
              <PhotoCameraIcon />
            </label>
            {badPreview ? <img src={badPreview} alt="badPreveiew" /> : null}
            <input
              onChange={badSelectFile}
              ref={badFileInput}
              id="ex_files"
              type="file"
            />
          </Bad>
        </CertificationBox>
      </Certification>
    </>
  );
}

const Certification = styled.div`
  width: 100%;
  height: 100%;
`;

const CertificationBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Good = styled.div`
  label {
    display: inline-block;
    padding: 0.5em 0.75em;
    color: #999;
    font-size: inherit;
    line-height: normal;
    vertical-align: middle;
    background-color: #fdfdfd;
    cursor: pointer;
    border: 1px solid #ebebeb;
    border-bottom-color: #e2e2e2;
    border-radius: 0.25em;
  }

  input[type="file"] {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
`;

const Bad = styled.div`
  label {
    display: inline-block;
    padding: 0.5em 0.75em;
    color: #999;
    font-size: inherit;
    line-height: normal;
    vertical-align: middle;
    background-color: #fdfdfd;
    cursor: pointer;
    border: 1px solid #ebebeb;
    border-bottom-color: #e2e2e2;
    border-radius: 0.25em;
  }

  input[type="file"] {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
`;

const Preview = styled.div`
  width: 7.08vw;
  height: 12.59vh;
  background-color: #e5e5e5;
  border-radius: 16px;
`;
const PreviewBtn = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default CreateCertification;
