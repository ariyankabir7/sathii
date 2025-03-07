import React, { useEffect, useState } from "react";

// antd
import { Popconfirm } from "antd";
import "antd/dist/antd.css";

// base url
import { baseURL } from "../util/config";
// dayjs
import dayjs from "dayjs";
// routing
import { Link, useHistory,useLocation } from "react-router-dom";
// action
import {
  getComment,
  getLike,
  allowDisallowComment,
  deleteComment,
  videoDetails,
} from "../store/video/action";
// redux
import { connect, useDispatch, useSelector } from "react-redux";



//image
import Male from "../assets/images/male.png";

const VideoDetail = (props) => {
  const history = useHistory();
  // const detail = JSON.parse(localStorage.getItem("VideoDetail"));
  let now = dayjs();

  const { state } = useLocation();


  console.log('historyhistoryhistoryhistory', state)

  const { videoDetail } = useSelector((state) => state.video);

  const [allowComment, setAllowComment] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const dispatch = useDispatch();

  


  useEffect(() => {
    
    dispatch(videoDetails(state?.id));
  }, [dispatch, state?.id]);

  useEffect(() => {
    setAllowComment(videoDetail?.allowComment);
    setCommentCount(videoDetail?.comment); 
  }, [videoDetail?.allowComment, videoDetail?.comment]);

  useEffect(() => {
    dispatch(getComment(state?.id));
    dispatch(getLike(state?.id));
  }, [dispatch,state?.id]);

  const comment = useSelector((state) => state.video.comment);
  const like = useSelector((state) => state.video.like);

  const handleSwitch = (videoId) => {
    
    setAllowComment(!allowComment);
    props.allowDisallowComment(videoId);
  };

  function handleDelete(commentId) {
    
    props.deleteComment(commentId);
    setCommentCount(commentCount - 1);
    // message.success('Click on Yes');
  }

  const handleUserInfo = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    history.push("/admin/user/detail");
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last"></div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav
              aria-label="breadcrumb"
              className="breadcrumb-header float-start float-lg-end"
            >
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/admin/dashboard" className="text-danger">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/admin/video" className="text-danger">
                    Relite
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Detail
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div class="card card-bg">
        <div class="card-body">
          <div class="row">
            <div class="col-md-12 col-lg-5">
              <div class="post">
                <div
                  class="post-header pointer-cursor"
                  onClick={() => handleUserInfo(videoDetail?.userId)}
                >
                  <img
                    src={videoDetail?.userId?.image ? videoDetail?.userId?.image : Male}
                    alt=""
                  />
                  <div class="post-info">
                    <span class="post-author">{videoDetail?.userId?.username}</span>
                    <br />
                    <span class="post-date">
                      {now.diff(videoDetail?.date, "minute") <= 60 &&
                      now.diff(videoDetail?.date, "minute") >= 0
                        ? now.diff(videoDetail?.date, "minute") + " minutes ago"
                        : now.diff(videoDetail?.date, "hour") >= 24
                        ? dayjs(videoDetail?.date).format("DD MMM, YYYY")
                        : now.diff(videoDetail?.date, "hour") + " hour ago"}
                    </span>
                  </div>
                </div>
                <div class="post-body">
                  <p>{videoDetail?.userId?.caption}</p>
                  <video
                    controls
                    src={videoDetail?.video}
                    class="post-image"
                    alt=""
                  />
                </div>
                <div id="myGroup">
                  <div class="post-actions">
                    <ul class="list-unstyled">
                      <li>
                        <a
                          class="like-btn"
                          data-toggle="collapse"
                          href="#collapseExample"
                          role="button"
                          aria-expanded="false"
                          aria-controls="collapseExample"
                        >
                          {videoDetail?.like} Likes
                        </a>
                      </li>
                      <li>
                        <a
                          class="like-btn"
                          data-toggle="collapse"
                          href="#collapseComment"
                          role="button"
                          aria-expanded="false"
                          aria-controls="collapseComment"
                        >
                          {commentCount} Comments
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div class="post-comments">
                    <div
                      class="collapse"
                      id="collapseExample"
                      data-parent="#myGroup"
                      style={{ maxHeight: 250, overflow: "auto" }}
                    >
                      <div class="row">
                        <div class="col-12">
                          {like?.length > 0 ? (
                            like.map((like) => {
                              return (
                                <div class="post-comm post-padding">
                                  <img
                                    src={like.image ? like.image : Male}
                                    class="comment-img"
                                    alt=""
                                    onClick={() => handleUserInfo(like.user)}
                                  />
                                  <div class="comment-container">
                                    <span class="comment-author pointer-cursor">
                                      <span
                                        onClick={() =>
                                          handleUserInfo(like.user)
                                        }
                                      >
                                        {like.name}
                                      </span>
                                      <small class="comment-date">
                                        {like.time}
                                      </small>
                                    </span>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-center">No data found</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      class="collapse"
                      id="collapseComment"
                      data-parent="#myGroup"
                      style={{ maxHeight: 250, overflow: "auto" }}
                    >
                      <div class="row">
                        <div class="col-12">
                          {comment?.length > 0 ? (
                            comment.map((comment, index) => {
                              return (
                                <div class="post-comm post-padding">
                                  <img
                                    src={comment.image ? comment.image : Male}
                                    class="comment-img commentImg"
                                    alt=""
                                    onClick={() => handleUserInfo(comment.user)}
                                  />
                                  <div class="comment-container">
                                    <span class="comment-author pointer-cursor">
                                      <span
                                        onClick={() =>
                                          handleUserInfo(comment.user)
                                        }
                                      >
                                        {comment.name}
                                      </span>
                                      <small class="comment-date">
                                        {comment.time}
                                        <Popconfirm
                                          title="Are you sure to delete this comment?"
                                          onConfirm={() =>
                                            handleDelete(comment._id)
                                          }
                                          okText="Yes"
                                          cancelText="No"
                                          placement="top"
                                        >
                                          <i className="fas fa-trash-alt text-danger comment-delete pointer-cursor"></i>
                                        </Popconfirm>
                                      </small>
                                    </span>
                                    <span className="pointer-cursor">
                                      {comment.comment}
                                    </span>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-center">No data found</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-1"></div>
            <div class="col-md-12 col-lg-6" style={{ overflowX: "auto" }}>
              <h5 class="card-title">About</h5>
              <hr />
              <table className="table">
                <tbody>
                  <tr className="border-bottom">
                    <td className="align-top">Caption</td>
                    <td className="align-top">:</td>
                    <td>{videoDetail?.caption}</td>
                  </tr>
                  <tr className="border-bottom">
                    <td>Location</td>
                    <td>:</td>
                    <td>{videoDetail?.location ? videoDetail?.location : "-"}</td>
                  </tr>
                  <tr className="border-bottom">
                    <td>Thumbnail</td>
                    <td>:</td>
                    <td>
                      <a
                        href={baseURL + videoDetail?.thumbnail}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {videoDetail?.thumbnail}
                      </a>
                    </td>
                  </tr>
                  <tr className="border-bottom">
                    <td>Screenshot</td>
                    <td>:</td>
                    <td>
                      <a
                        href={baseURL + videoDetail?.screenshot}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {videoDetail?.screenshot}
                      </a>
                    </td>
                  </tr>
                  <tr className="border-bottom">
                    <td>Song</td>
                    <td>:</td>
                    <td>
                      {videoDetail?.isOriginalAudio ? (
                        "-"
                      ) : (
                        <a
                          href={baseURL + videoDetail?.song}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {videoDetail?.song?.title}
                        </a>
                      )}
                    </td>
                  </tr>
                  <tr className="border-bottom">
                    <td>Original Audio?</td>
                    <td>:</td>
                    <td>{videoDetail?.isOriginalAudio ? "true" : "false"}</td>
                  </tr>
                  <tr className="border-bottom">
                    <td>Duration</td>
                    <td>:</td>
                    <td>{videoDetail?.duration}</td>
                  </tr>
                  <tr className="border-bottom">
                    <td>Video Size</td>
                    <td>:</td>
                    <td>{videoDetail?.size}</td>
                  </tr>
                  <tr className="border-bottom">
                    <td>Hashtag</td>
                    <td>:</td>
                    <td>{videoDetail?.hashtag?.join(",").replace(/['"]+/g, "")} </td>
                  </tr>
                  <tr className="border-bottom">
                    <td>Mention People</td>
                    <td>:</td>
                    <td>
                      {/* {videoDetail?.mentionPeople?.map((data) => {
                        return data?.username;
                      })} */}
                      {videoDetail?.mentionPeople?.join(",").replace(/['"]+/g, "")}
                    </td>
                  </tr>
                  {/* <tr className="border-bottom">
                    <td>Like</td>
                    <td>:</td>
                    <td>{videoDetail?.like}</td>
                  </tr>
                  <tr className="border-bottom">
                    <td>Comment</td>
                    <td>:</td>
                    <td>{videoDetail?.comment}</td>
                  </tr> */}
                  <tr>
                    <td>Allow Comment On Video?</td>
                    <td>:</td>
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={allowComment}
                          onChange={() => handleSwitch(videoDetail?._id)}
                        />
                        <span className="slider">
                          <p
                            style={{
                              fontSize: 12,
                              marginLeft: `${allowComment ? "-25px" : "35px"}`,
                              color: "#000",
                              marginTop: "6px",
                            }}
                          >
                            {allowComment ? "Yes" : "No"}
                          </p>
                        </span>
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  getComment,
  getLike,
  allowDisallowComment,
  deleteComment,
})(VideoDetail);
