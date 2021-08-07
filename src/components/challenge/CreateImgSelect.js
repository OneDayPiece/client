import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as imageActions } from "../../redux/modules/challengeCreate";
import styled from "styled-components";
// modal
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";


function CreateImgSelect({ challengeInfo, setChallengeInfo, id }) {
  const dispatch = useDispatch();
  const select = useSelector((state) => state.create.thumnailList);
  const challenge_info = useSelector((state) => state.challengeDetail.detail);

  const [preview, setPreview] = useState("");

  // modal state
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    if (id) {
      setOpen(true);
      dispatch(imageActions.getThumnailDb(challenge_info.categoryName));
    } else {
      if (!challengeInfo.categoryName) {
        window.alert("카테고리를 먼저 정해주세요!");
        return;
      }
      setOpen(true);
      dispatch(imageActions.getThumnailDb(challengeInfo.categoryName));
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  // 대표이미지 선택
  const selectImg = (img) => {
    setChallengeInfo({
      ...challengeInfo,
      challengeImgUrl: img,
    });

    setPreview(img);
    handleClose();
  };

  return (
    <>
    <SubT>대표 이미지 업로드 / 선택</SubT>
      <ImageBtn onClick={handleClickOpen}>
        이미지를 선택해주세요.{" "}
      </ImageBtn>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          {select.map((i, idx) => {
            return (
              <div key={idx}>
                <img src={i} onClick={() => selectImg(i)} alt="" />
              </div>
            );
          })}
        </DialogContent>
      </Dialog>
      <Preview id={id} preview={preview} challenge_info={challenge_info} />
    </>
  );
}

const Preview = ({ id, preview, challenge_info }) => {
  if (id && !preview) {
    return <img src={challenge_info.challengeImgUrl} alt="thumbnail" />;
  } else if (!id && !preview) {
    return null;
  } else {
    return <img src={preview} alt="thumbnail_preview" />;
  }
};

export default CreateImgSelect;


const SubT = styled.p`
  font-size: ${({theme}) => theme.fontSizes.xs};
  font-weight: 400;
  color : ${({theme}) => theme.colors.darkGray};
  margin-bottom : 8px;
`;

const ImageBtn = styled.button`
  font-size: ${({theme}) => theme.fontSizes.ms};
  background-color: ${({theme}) => theme.colors.lightGray};
  color: ${({theme}) => theme.colors.darkGray};
  width: 15.00vw;
  padding: 1.018vh;
  padding-left: 0.83vw;
  border-radius: 8px;
  margin-bottom: 2.96vh;
`;
