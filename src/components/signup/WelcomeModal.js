import React from "react";
import styled from "styled-components";

import Dialog from "@material-ui/core/Dialog";

import popup from "../../assets/images/logo/popup_2.png";
import close from "../../assets/images/icons/close.svg";

import { useDispatch, useSelector } from "react-redux";
import { userCreators } from "../../redux/modules/user";
import { history } from "../../redux/configureStore";
import { Image } from "../../elements";

const WelcomeModal = (props) => {
  const dispatch = useDispatch();

  const is_complete = useSelector((state) => state.user.is_complete);

  const goToLogin = () => {
    history.replace("/login");
    dispatch(userCreators.complete(false));
  };

  return (
    <>
      <Dialog
        open={is_complete}
        onClose={goToLogin}
        maxWidth={false}
        disableScrollLock={true}
        aria-labelledby="form-dialog-title"
        PaperProps={{
          style: {
            width: "28.13vw",
            height: "50vh",
            borderRadius: "10px",
            overflowY: "hidden",
            padding: "0px",
          },
        }}
      >
        <Container>
        <CloseImg src={close} alt="close" onClick={goToLogin}/>
          <Text>
            <p>
              {props.nick}님!
              <br />
              회원가입을 축하합니다.
              <br />
              첫 만남 기념으로 노랑하루를 드릴게요 :-)
              <br />
              챌린지를 열심히 달성하여
              <br />
              하루 뱃지를 GET 해보세요!
            </p>
          </Text>
        </Container>
        <Image width="28.13vw" height="50vh" src={popup} alt="popup" />
      </Dialog>
    </>
  );
};

export default WelcomeModal;

const Container = styled.div`
  width: 100%;
  text-align: center;
  /* & > img {
    position: absolute;
    top: 19px;
    left: 25.84vw;
  } */
`;

const CloseImg = styled.img`
  position: absolute;
  width: 26px;
  height: 26px;
  top: 19px;
  left: 25.84vw;
  z-index: 11px;
  cursor: pointer;
`;

const Text = styled.div`
  width: 100%;
  padding: 5.55vh 0px;
  z-index: 10;
  & > p {
    font-size: ${({ theme }) => theme.fontSizes.md};
  }
`;
