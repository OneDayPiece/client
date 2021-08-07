import { createAction, handleActions } from "redux-actions";
import produce from "immer";
import { ChallengeDetailApis } from "../../shared/api";
import { consoleLogger } from "../configureStore";

import AWS from "aws-sdk";
import { MainCreators } from "./main";

const GET_CHALLENGE_DETAIL = "GET_CHALLNENG_DETAIL";
const EDIT_CHALLENGE = "EDIT_CHALLENGE";
const LOADING = "LOADING";

const getChallengeDetail = createAction(GET_CHALLENGE_DETAIL, (challenge) => ({
  challenge,
}));
const editChallengeDetail = createAction(
  EDIT_CHALLENGE,
  (challenge_detail) => ({
    challenge_detail,
  })
);

const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

const initialState = {
  detail: {
    challengeId: 1,
    memberId: 1,
    memberName: "만주리아", //챌린지 만든사람 이름
    challengeTitle: "하루에 한끼 비건식",
    challengeContent:
      "건강도 챙기고 맛도 챙기는 비건, 하루에 한번씩 실천해 보야요 :)",
    categoryName: "생활습관",
    challengePassword: "1234", // 비공개면 비밀번호 들어감
    challengeStartDate: "2021-07-26",
    challengeEndDate: "2021-08-02",
    challengeProgress: 1,
    challengeGood:
      "https://user-images.githubusercontent.com/75834421/127076439-599fa607-9285-4ab6-aec6-54ba16567434.png",
    challengeBad:
      "https://user-images.githubusercontent.com/75834421/127076583-de2aadb3-2dd2-4778-a59e-e68f9dc3aded.png",
    challengeHollyday: " ",
    challengeMember: [1, 2, 3, 4], //챌린지에 참여한 유저아이디
  },
  is_loading: false,
};

const getChallengeDetailDB =
  (challenge_id) =>
  (dispatch, getState, { history }) => {
    //챌린지 상세페이지에서 상세내용 불러오기
    ChallengeDetailApis.getDetail(challenge_id)
      .then((res) => {
        consoleLogger("챌린지 상세페이지 정보 불러오기 요청 후 응답: ", res);
        dispatch(getChallengeDetail(res.data));
      })
      .catch((error) => {
        if (
          window.confirm(
            "챌린지 상세내용을 불러오는데 실패했어요ㅜㅜ 메인화면으로 돌아가도 될까요?"
          )
        ) {
          history.push("/");
        } else {
          history.goBack();
        }
        consoleLogger(error);
      });
  };

// 챌린지 개설한 유저가 챌린지 전체 내용 수정할 때
const editChallengeDB =
  (challenge_id, challengeInfo) =>
  (dispatch, getState, { history }) => {
    const date = new Date();
    const user_info = getState().user.userInfo;

    AWS.config.update({
      region: "ap-northeast-2",
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: `${process.env.REACT_APP_AWS_KEY}`,
      }),
    });

    dispatch(loading(true));

    const upload1 = new AWS.S3.ManagedUpload({
      params: {
        Bucket: "onedaypiece-shot-image",
        Key:
          challengeInfo.challengeGood.name +
          `${user_info.nickname}` +
          date +
          ".jpg",
        Body: challengeInfo.challengeGood,
      },
    });
    const upload2 = new AWS.S3.ManagedUpload({
      params: {
        Bucket: "onedaypiece-shot-image",
        Key:
          challengeInfo.challengeBad.name +
          `${user_info.nickname}` +
          date +
          ".jpg",
        Body: challengeInfo.challengeBad,
      },
    });

    const promise1 = upload1.promise();
    const promise2 = upload2.promise();

    promise1.then((data) => {
      challengeInfo = { ...challengeInfo, challengeGood: data.Location };
      promise2
        .then((data) => {
          consoleLogger("두번째 이미지 업로드", data);
          challengeInfo = {
            ...challengeInfo,
            challengeBad: data.Location,
            challengeId: challenge_id,
          };
          consoleLogger("db로 보내기전 challengeInfo", challengeInfo);

          ChallengeDetailApis.editDetail(challengeInfo)
            .then((res) => {
              consoleLogger("챌린지 수정 요청 후 응답", res);
              dispatch(editChallengeDetail(challengeInfo));
              window.alert("챌린지 수정 완료!");
              history.push(`/challenge/${challenge_id}`);
            })
            .catch((error) => {
              if (
                window.confirm(
                  "챌린지 수정에 실패했어요ㅜㅜ 메인화면으로 돌아가도 될까요?"
                )
              ) {
                history.push("/");
              } else {
                history.goBack();
              }
              consoleLogger(
                "챌린지 개설한 사용자가 수정페이지에서 수정 버튼 눌렀을 때 오류: " +
                  error
              );
            })
            .catch((error) => {
              consoleLogger("나쁜 예시 이미지 에러", error);
            });
        })
        .catch((error) => {
          consoleLogger("좋은 예시 이미지 에러", error);
        });
    });
  };

// 관리자 권한으로 DB에 있는 어떤 챌린지든 제약 없이 삭제 하는 함수
const adminChallengeDeleteDB =
  (challenge_id) =>
  (dispatch, getState, { history }) => {
    ChallengeDetailApis.adminDeleteDetail(challenge_id)
      .then((res) => {
        consoleLogger("관리자권한 강제 삭제 요청 후 응답: ", res);
        const challengeInfo = getState().challengeDetail.detail;
        //메인화면에서 불러오는 challenge_list 삭제하는 action 다른 모듈에서 가져오기 => 일단은 이 모듈에서 구현
        dispatch(
          MainCreators.deleteUserLoad(challengeInfo.categoryName, challenge_id)
        );

        window.alert("관리자 권한 챌린지 삭제 완료!");
        history.replace("/");
      })
      .catch((error) => consoleLogger("관리자 권한 삭제 중 오류: " + error));
  };

const challengeDeleteDB =
  (challenge_id) =>
  (dispatch, getState, { history }) => {
    ChallengeDetailApis.deleteDetail(challenge_id)
      .then((res) => {
        consoleLogger("챌린지 개설한 사용자가 삭제 요청시 응답: " + res);
        const challengeInfo = getState().challengeDetail.detail;

        if (window.confirm("정말 챌린지를 삭제하시겠어요?")) {
          dispatch(
            MainCreators.deleteUserLoad(
              challengeInfo.categoryName,
              challenge_id
            )
          );
          window.alert("챌린지 삭제 완료!");
          history.replace("/");
        }
      })
      .catch((error) => {
        if (
          window.confirm(
            "챌린지 삭제에 실패했어요ㅜㅜ 메인화면으로 돌아가도 될까요?"
          )
        ) {
          history.push("/");
        } else {
          history.goback();
        }
        consoleLogger(
          "챌린지 개설한 사용자가 삭제 버튼 눌렀을 때 오류: " + error
        );
      });
  };

//사용자가 챌린지 포기 버튼 눌렀을 때
const giveupChallengeDB =
  (challenge_id) =>
  (dispatch, getState, { history }) => {
    ChallengeDetailApis.giveupChallenge(challenge_id)
      .then((res) => {
        consoleLogger("챌린지 포기 요청후 응답: " + res);
        //user 정보 불러오는 부분은 고쳐야함
        const user_info = getState().user.userInfo;
        const challenge_detail = getState().challengeDetail.detail;

        const new_member_list = challenge_detail.challengeMember.filter(
          (id) => id !== user_info.memberId
        );

        const new_challenge_info = {
          ...challenge_detail,
          challengeMember: new_member_list,
        };

        dispatch(editChallengeDetail(new_challenge_info));
        window.alert("챌린지 참여취소가 완료되었습니다!");
        history.replace("/mypage/now");
      })
      .catch((error) => {
        if (
          window.confirm(
            "챌린지 참여 취소에 실패했어요ㅜㅜ 메인화면으로 돌아가도 될까요?"
          )
        ) {
          history.push("/");
        } else {
          history.goback();
        }
        consoleLogger(
          "참여중이던 사용자가 챌린지 포기 버튼 눌렀을 때: " + error
        );
      });
  };

//챌린지 신청하기
const takeInPartChallengeDB =
  (challenge_id, challengePwd = "") =>
  (dispatch, getState, { history }) => {
    const challengeInfo = {
      challengeId: challenge_id,
      challengePassword: challengePwd,
    };
    ChallengeDetailApis.takeInPartChallenge(challengeInfo)
      .then((res) => {
        consoleLogger("챌린지 신청하기 요청 후 응답: " + res);

        //user 정보 불러오는 부분은 고쳐야함
        const user_info = getState().user.userInfo;
        const challenge_detail = getState().challengeDetail.detail;

        const new_member_list = [
          ...challenge_detail.challengeMember,
          user_info.memberId,
        ];

        const new_challenge_info = {
          ...challenge_detail,
          challengeMember: new_member_list,
        };

        dispatch(editChallengeDetail(new_challenge_info));
        window.alert(`${challenge_detail.challengeTitle} 챌린지 신청 완료!`);
        history.push("/mypage/now");
      })
      .catch((error) => {
        if (
          window.confirm(
            "챌린지 신청에 실패했어요ㅜㅜ 메인화면으로 돌아가도 될까요?"
          )
        ) {
          history.push("/");
        } else {
          history.goBack();
        }
        consoleLogger(
          "참여신청 버튼이나 신청하기(비밀번호 있는 경우) 버튼 누른 경우: " +
            error
        );
      });
  };

export default handleActions(
  {
    [GET_CHALLENGE_DETAIL]: (state, action) =>
      produce(state, (draft) => {
        draft.detail = action.payload.challenge;
      }),

    [EDIT_CHALLENGE]: (state, action) =>
      produce(state, (draft) => {
        draft.detail = action.payload.challenge_detail;
        draft.is_loading = false;
      }),

    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      }),
  },
  initialState
);

const actionCreator = {
  getChallengeDetailDB,
  adminChallengeDeleteDB,
  challengeDeleteDB,
  giveupChallengeDB,
  takeInPartChallengeDB,
  editChallengeDB,
};

export { actionCreator };
