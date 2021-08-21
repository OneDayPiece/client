import React from "react";
import styled from "styled-components";

import ConditionBtn from "../components/challengedetail/ConditionBtn";
import { Button } from "../elements/index";
import StateBox from "../components/challengedetail/StateBox";
import ChallengeInfo from "../components/challengedetail/ChallengeInfo";
import ShotList from "../components/challengedetail/ShotList";

import { history } from "../redux/configureStore";
import { useDispatch, useSelector } from "react-redux";
import { actionCreator as challengeDetailActions } from "../redux/modules/challengeDetail";
import { Link, Route, Switch } from "react-router-dom";
import Chat from "../components/chat/Chat";

const ChallengeDetail = (props) => {
  const dispatch = useDispatch();
  const challenge = useSelector((state) => state.challengeDetail.detail);
  const user_info = useSelector((state) => state.user.userInfo);
  const pathname = useSelector((state) => state.router.location.pathname);

  const challengeId = props.match.params.id;

  //challenge날짜수 계산
  const start = challenge.challengeStartDate?.split("T")[0].split("-");
  const date1 = new Date(start[0], start[1][1] - 1, start[2]);

  const end = challenge.challengeEndDate?.split("T")[0].split("-");
  const date2 = new Date(end[0], end[1][1] - 1, end[2]);

  const totalSecond = date2.getTime() - date1.getTime();
  const totalDay = totalSecond / 1000 / 60 / 60 / 24;

  //오늘 날짜를 특정 날짜와 비교하기 위해 형태 변경해주는 함수
  // 2021-07-06 이런 형태로 만들어줌
  const leadingZeros = (n, digits) => {
    let zero = "";
    n = n.toString();

    if (n.length < digits) {
      for (let i = 0; i < digits - n.length; i++) zero += "0";
    }
    return zero + n;
  };

  let today = new Date();
  const progress = today.getTime() - date1.getTime();
  let progressDays = progress / 1000 / 60 / 60 / 24;

  let progressPercent = parseInt(progressDays / totalDay);

  if (progressDays < 0 || isNaN(progressPercent)) {
    progressPercent = 0;
  }

  today =
    leadingZeros(today.getFullYear(), 4) +
    "-" +
    leadingZeros(today.getMonth() + 1, 2) +
    "-" +
    leadingZeros(today.getDate(), 2);

  //사용자가 자기가 만든 챌린지 수정 => 챌린지 시작전에만 수정 가능
  const editChallenge = () => {
    history.push(`/${challenge.challengeId}/edit`);
  };
  //사용자가 자기가 만든 챌린지 삭제 => 챌린지 시작전에만 삭제 가능
  const deleteChallenge = () => {
    dispatch(challengeDetailActions.challengeDeleteDB(challenge.challengeId));
  };

  const {
    match: { path, url },
  } = props;

  return (
    <DetailContainer>
      {" "}
      <Chat challengeId={challengeId} />
      <Area>
        <StateContainer>
          {/* banner 랑 navbar */}
          <ChallengeHeader>
            <Banner bgImg={challenge.challengeImgUrl}>
              <Title>{challenge.challengeTitle}</Title>
              <TotalNum>
                참여 {challenge.challengeMember.length}명 | 진행률{" "}
                {progressPercent * 100} %
              </TotalNum>
            </Banner>
            <NavBar>
              <ul>
                <Item selected={pathname.includes("/intro")}>
                  <Link to={`${url}/intro`}>챌린지 소개</Link>
                </Item>
                <Item selected={pathname.includes("/post")}>
                  <Link to={`${url}/post`}>인증목록</Link>
                </Item>
              </ul>
            </NavBar>
          </ChallengeHeader>
          <Switch>
            <Route exact path={`${path}/intro`} component={ChallengeInfo} />
            <Route exact path={`${path}/post`} component={ShotList} />
          </Switch>
        </StateContainer>
        {/* 오른쪽 사용자 상태박스 & 버튼 */}
        <RightNav>
          <StateBox />
          <Btns>
            {/* 챌린지 개설한 사용자의 memberId와 로그인한 유저의 memberId가 일치할 때 && 챌린지가 시작 전일 때 이 버튼 띄우기 */}
            {user_info?.memberId === challenge.memberId &&
            today < challenge.challengeStartDate.split("T")[0] ? (
              <MobilBtns half>
                <Button
                  width="100%"
                  height="5.93vh"
                  bg="white"
                  color="mainGreen"
                  border="lightGray"
                  margin="0 0 1.48vh 0"
                  _onClick={editChallenge}
                >
                  챌린지 수정하기
                </Button>
                <Button
                  width="100%"
                  height="5.93vh"
                  margin="0 0 1.48vh 0"
                  _onClick={deleteChallenge}
                >
                  {/* (챌린지 개설한 사용자) */}
                  챌린지 없애기
                </Button>
              </MobilBtns>
            ) : (
              <MobilBtns>
                <ConditionBtn
                  {...challenge}
                  today={today}
                  challengeStartDate={
                    challenge.challengeStartDate.split("T")[0]
                  }
                />
              </MobilBtns>
            )}
          </Btns>
        </RightNav>
      </Area>
    </DetailContainer>
  );
};

export default ChallengeDetail;

const DetailContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  ${({ theme }) => theme.device.mobileLg} {
    display: inherit;
  }
`;

const Area = styled.div`
  display: grid;
  margin-top: 3.02vw;
  width: 66.67vw;
  height: 100%;
  grid-template-rows: 1fr 3fr;
  grid-template-areas:
    "banner nav"
    "banner btns";
  grid-gap: 20px;
  ${({ theme }) => theme.device.mobileLg} {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
`;

const ChallengeHeader = styled.div`
  display: flex;
  flex-direction: column;
  width: 49.48vw;
  /* height: 40.55vh; */
  justify-content: center;
  /* margin-top: 3.02vw; */
  margin-bottom: 3.7vh;
  background-color: ${({ theme }) => theme.colors.white};
  ${({ theme }) => theme.device.mobileLg} {
    width: 100%;
    padding: 5vw 4.44vw 0 4.44vw;
  }
`;

const StateContainer = styled.div`
  width: 49.48vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-area: banner;
  ${({ theme }) => theme.device.mobileLg} {
    width: 100%;
    /* height: 100vh; */
  }
`;

const Btns = styled.div`
  width: 16.15vw;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 17.08vw;
  /* margin-top: 2.59vh; */
  ${({ theme }) => theme.device.mobileLg} {
    width: 100%;
    height: 11vh;
    flex-direction: row;
    position: fixed;
    z-index: 15;
    top: auto;
    bottom: 0;
    right: 0;
    margin-top: 0;
  }
`;

const MobilBtns = styled.div`
  ${({ theme }) => theme.device.mobileLg} {
    font-size: 17px;
    width: 100%;
    height: 11vh;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background-color: white;
    box-shadow: 0 4px 11px 0px ${({ theme }) => theme.colors.mainGreen};
    ${(props) =>
      props.half
        ? "button { margin: 0; width: 43.33vw;}"
        : "button {margin: 0;} padding: 0 4.44vw;"}
  }
`;

const RightNav = styled.div`
  width: 16.15vw;
  position: relative;
  /* left: 50.52vw; */
  grid-area: nav;
  ${({ theme }) => theme.device.mobileLg} {
    width: 100%;
  }
`;

const Banner = styled.div`
  background-image: url(${(props) => props.bgImg});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 15.63vw;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${({ theme }) => theme.device.mobileLg} {
    height: 41.67vw;
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.white};
  font-weight: bold;
  margin-bottom: 2.5%;
  ${({ theme }) => theme.device.mobileLg} {
    font-size: 24px;
  }
`;

const TotalNum = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  ${({ theme }) => theme.device.mobileLg} {
    font-size: 16px;
  }
`;

const NavBar = styled.nav`
  width: 100%;
  height: 7.4vh;
  display: flex;
  align-items: center;
  ul {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
`;

const Item = styled.li`
  width: 155px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5em;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: bold;
  ${(props) =>
    props.selected
      ? `border-bottom: 4px solid ${props.theme.colors.mainGreen};`
      : null}
  ${({ theme }) => theme.device.mobileLg} {
    width: 50%;
    margin: 0;
    font-size: 16px;
  }
`;
